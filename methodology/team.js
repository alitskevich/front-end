class Team extends Entity {
   static FIELDS = {
       members: '[]Member'
   }
}

class MemberRole extends Enum {
    static ELT = {
        Dev:'',
        Leader:''
    }
}

class Member extends Entity {
    static FIELDS = {
        person: 'Person',
        role: 'MemberRole'
    }
}

class Person extends Entity {
    static FIELDS = {
        name: 'string',
        level: 'SkillLevel'
    }
}