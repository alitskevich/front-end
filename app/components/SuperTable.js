import Component from 'ui/Component.js';
import './SuperTable.scss';
const ISIZE = 20;
let RESIZING = null;
export class SuperTableHeaderCell extends Component {

  static TEMPLATE = `<div>
    <a class="splitter" mousedown="{{onMouseDown}}" mouseup="{{onMouseUp}}"/>
    <div>{{column.name}}</div>
  </div>`;

  static PROPS = {
    column: {}
  }

  onInit() {

  }

  onMouseDown(event) {

    // this.element.className += ' dragged';
    RESIZING = event;
    RESIZING.X = event.clientX;
    RESIZING.element = this.element;
    RESIZING.column = this.column;
    if (event) {event.preventDefault();}
    return false;
  }

  onMouseUp(event) {

    // this.element.className += ' dragged';
    RESIZING = null;
    if (event) {event.preventDefault();}
    return false;
  }

}

export class SuperTableCell extends Component {

  static TEMPLATE = `<span>{{value}}</span>`;

  static PROPS = {
    value: { default: null },
    data:{}
  }
}

export default class SuperTable extends Component {

  static TEMPLATE =
    `<div class="super-table">
      <div class="row header" mousemove="{{onHeaderMouseMove}}">
        <div class="cols free-cols">
          <div each="col of freeCols" class="col hcol {{cellClass}}">
             <SuperTableHeaderCell column="{{col}}"/>
          </div>
        </div>
        <div class="cols frozen-cols">
          <div each="col of frozenCols" class="col hcol {{cellClass}}">
             <SuperTableHeaderCell column="{{col}}"/>
          </div>
        </div>
      </div>
      <div class="container" scroll="{{onScroll}}" wheel="{{onWheel}}">
        <div class="content">
        <div class="grid">
            <div each="row of viewRows" class="row">
                <div class="cols free-cols">
                  <div each="col of freeCols" class="col {{cellClass}}">
                      <ui:cellType value="{{cellValue}}" data="{{row}}" meta="{{col}}"/>
                  </div>
                </div>
                <div class="cols frozen-cols">
                  <div each="col of frozenCols" class="col {{cellClass}}">
                      <ui:cellType value="{{cellValue}}" data="{{row}}" meta="{{col}}"/>
                  </div>
                </div>
            </div>
        </div>
        <block if="data.length">
        <else><small class="empty">{{emptyMessage}}</small></else>
        </block>
      </div>
      </div>
    </div>`;

  static PROPS = {
    value: { default: null },
    columns:{
      default: [{ id:name }],
      set: ($, key, value) => {
        $.frozenCols = [];
        $.freeCols = [];
        $.frozenColsWidth = 0;
        $.freeColsWidth = 0;
        value
          .filter(e=>!e.hidden)
          .forEach((e, index) => {
          const ee = { name: e.id, ...e, index, width: e.width || 60 };
          if (e.required) {
            $.frozenCols.push(ee);
            $.frozenColsWidth += ee.width;
          } else {
            $.freeCols.push(ee);
            $.freeColsWidth += ee.width;
          }
        });
    }
    },
    valueChanged:{ },
    data: {
      default: [],
      set: ($, key, value) => {
        $.state.data = value;
        const c = $.contentElt;
        if (c) {

          c.style.height = value.length * ISIZE;
        }

      }
    },
    emptyMessage: { default: 'Empty list' }
  }

  get clusterSize() {

    const el = this.containerEl;
    const h = el && el.clientHeight || 800;
    const size = (h - h % ISIZE) / ISIZE;

    return size;
  }

  get viewRows() {

    const from = this.index || 0;
    return this.data
      .slice(from, from + this.clusterSize + 20);
  }

  get cellValue() {

    const item = this.get('row');
    const col = this.get('col');

    return item[col.id];
  }

  get cellType() {

    const col = this.get('col');

    return col.type || 'SuperTableCell';
  }

  get cellClass() {

    const col = this.get('col');

    return `col-${col.index}`;
  }

  onInit() {

    this.scrollTop = 0;
    this.index = 0;
    this.colIndex = 0;
    this.containerEl = this.element.firstChild.nextSibling;
    this.contentElt = this.containerEl.firstChild;
    this.gridElt = this.contentElt.firstChild;

    this.contentElt.style.height = this.data.length * ISIZE;

    this.setOffsetLeft(this.frozenColsWidth);
  }

  onWheel(e) {

    if ( e.deltaX) {

      e.preventDefault();

      this.setOffsetLeft(-e.deltaX + (this.offsetLeft || 0));
    }
  }

  setOffsetLeft(d) {

    this.offsetLeft = Math.min(this.frozenColsWidth,
      Math.max(-this.freeColsWidth + this.frozenColsWidth + 60,
      d
    ));

    this.hSync();
  }

  onScroll(e) {

    const st = this.containerEl.scrollTop;
    const delta = st - this.scrollTop;

    if (Math.abs(delta) > ISIZE) {

      this.scrollTop = st;
      this.scrollDown = delta > 0;

      this.layout();
    }
  }
  onHeaderMouseMove(event) {

    if (RESIZING) {
      const delta = event.clientX - RESIZING.X;
      RESIZING.X = event.clientX;
      RESIZING.column.width += delta;
      this.frozenColsWidth = this.frozenCols.reduce((r, e)=>(r + e.width), 0);
      this.setOffsetLeft(this.frozenColsWidth);

      this.hSync();
    }
  }
  layout() {

    const st = this.scrollTop;
    const rest = st % ISIZE;
    const vIndex = (st - rest) / ISIZE;
    const delta = vIndex - this.index;
    const size = this.clusterSize;

    const newIndex = this.scrollDown ?
      Math.min(this.data.length - size, delta > size - 10 ? vIndex - 10 : this.index) :
      Math.max(0, delta < 10 ? vIndex - size + 10 : this.index);
    // this.log(st, newIndex, vIndex, this.index);

    if (newIndex !== this.index) {

      this.index = newIndex;

      const offset = Math.max(0, newIndex * ISIZE + (newIndex ? rest : 0));
      this.gridElt.style.top = offset + 'px';

      this.invalidate();
    }
  }

  invalidate() {

    super.invalidate();

    this.hSync();
  }

  hSync() {

    this.element.querySelectorAll('.free-cols').forEach(c=>{
      c.style.left = this.offsetLeft;
    });
    this.frozenCols.forEach(col=>this.element.querySelectorAll(`.col-${col.index}`).forEach(c=>{
      c.style.width = col.width;
    }));
    this.freeCols.forEach(col=>this.element.querySelectorAll(`.col-${col.index}`).forEach(c=>{
      c.style.width = col.width;
    }))
    ;

  }
}

Component.registerType(SuperTableHeaderCell);
Component.registerType(SuperTableCell);
Component.registerType(SuperTable);
