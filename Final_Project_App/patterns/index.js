const patternDict = [
    {
        pattern: '\\b(?<greeting>Hi|Hello|Hey|Salut|Bonjour)\\b',
        intent: 'Hello'
    },
    {
        pattern: 'and you',
        intent: 'goodand'
    },
    {
        pattern: '([gG]ood|[Gg]reat)',
        intent: 'good'
    },
    {
        pattern: 'gender',
        intent: 'gender'
    },
    {
        pattern: 'information',
        intent: 'gender'

    },
    {
        pattern: 'grade',
        intent: 'grade'

    },
    {
        pattern: 'propose|give',
        intent: 'Movie'
    },
    {
        pattern: '([gG]ive|[pP]ropose) (me )?(?<movie>[0-9]+) movie*$',
        intent: 'Movie'
    },
    {
        pattern: '[tT]hank [yY]ou',
        intent: 'thank'
    },
    {
        pattern: '\\b(bye|exit)\\b',
        intent: 'Exit'
    },
];

module.exports = patternDict;