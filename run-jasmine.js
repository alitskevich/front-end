function test() {
    var Jasmine = require('jasmine');
    var jasmine = new Jasmine();

    jasmine.loadConfig({
        spec_dir: 'src/ai',
        spec_files: [
            '**/*.test.js'
        ],
        helpers: [
            //'helpers/**/*.js'
        ]
    });
    jasmine.configureDefaultReporter({
        showColors: false
    });
    jasmine.execute();
}

test();
