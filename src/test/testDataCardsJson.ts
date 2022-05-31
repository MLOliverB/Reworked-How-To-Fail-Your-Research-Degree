// import * as activityCards from '../../resources/data/activity-cards.json';
// import * as eventCards from '../../resources/data/event-cards.json';
// import * as cardGroups from '../../resources/data/card-groups.json';

import fs from 'fs';
import assert from 'assert';
import { countNonAscii, showNonAscii, countOccurences, verifyCharacters } from './util';
import { parseEffect, parseLogicFunction, verifyBracketClosure } from '../dev/cards/eventCards';
import { LOGIC_BRACKET_CARD_CLOSE, LOGIC_BRACKET_CARD_OPEN } from '../dev/constants';
import { isCardGroup, isCardSlug, isCardStatement } from '../dev/cards/types';

var activityCards: any[] = require('../../resources/data/activity-cards');
var eventCards: any[] = require('../../resources/data/event-cards');
var cardGroups: any[] = require('../../resources/data/card-groups');

var cards: any[] = activityCards.concat(eventCards);
var cardSlugs = new Set<string>(Array.from(cards, (val,ix)=>val.slug));
// var cardSlugs: string[] = Array.from(cards, (val,ix)=>val.slug);


describe('Cards JSON Data', function() {
    describe('Common Properties', function() {
        cards.forEach(function(val, ix, arr) {
            describe(`Card '${val.title}' (${val.slug}) stage ${val.stage}`, function() {
                let propertiesExist = true;
                let propertiesCorrect = true;
                describe('Property Definitions', function() {
                    let allPassed = true;

                    it('should have title property', function() {
                        assert.notEqual(typeof val.title, 'undefined', 'title property is undefined');
                    });
                    it('should have slug property', function() {
                        assert.notEqual(typeof val.slug, 'undefined', 'slug property is undefined');
                    });
                    it('should have stage property', function() {
                        assert.notEqual(typeof val.stage, 'undefined', 'stage property is undefined');
                    });
                    it('should have image property', function() {
                        assert.notEqual(typeof val.image, 'undefined', 'image property is undefined');
                    });

                    afterEach('if current test passed', function() {
                        if (this.currentTest) {
                            allPassed = allPassed && (this.currentTest.state === 'passed');
                        }
                      });
                    after('if all Property Definitions tests passed', function() {
                        propertiesExist = allPassed;
                    });
                });
                describe('Property Tests', function() {
                    let allPassed = true;

                    before('skip if Property Definitions failed', function() {
                        if (!propertiesExist) {
                            this.skip();
                        }
                    });

                    describe('Title Property', function() {
                        it('should be type string', function() {
                            assert.equal(typeof val.title, 'string');
                        });
                        it('should only contain ascii characters', function() {
                            assert(countNonAscii(val.title) == 0, showNonAscii(val.title));
                        });
                    });
                    describe('Slug Property', function() {
                        it('should be type string', function() {
                            assert.equal(typeof val.slug, 'string');
                        });
                        it('should only contain ascii characters', function() {
                            assert(countNonAscii(val.slug) == 0, showNonAscii(val.slug));
                        });
                        it('should only contain alphanumeric characters and "-"', function() {
                            assert(verifyCharacters(val.slug, /[a-zA-Z0-9\-]/));
                        });
                        it('should be unique', function() {
                            assert(countOccurences(val.slug, Array.from(cards, x => x.slug)) == 1, 'Each slug must only occur once');
                        });
                        it('should follow naming convention', function() {
                            let slugSplit = val.slug.split("-");
                            assert.equal(slugSplit.length, 3, 'The slug should contain 3 sections separated by hyphens (-)');
                            assert(["act", "event"].includes(slugSplit[0]), 'Card must either be activity (act) or event (event) card');
                            assert(["PLAN", "CONTEXT", "IMP", "WRITEUP"].includes(slugSplit[1]), 'The stage must be either plan (PLAN), context (CONTEXT), implementation (IMP), or write-up (WRITEUP)');
                        });
                    });
                    describe('Stage Property', function() {
                        it('should be type number', function() {
                            assert.equal(typeof val.stage, 'number');
                        });
                        it('should be either 1, 2, 3, or 4', function() {
                            assert([1, 2, 3, 4].includes(val.stage), );
                        });
                    });
                    describe('Image Property', function() {
                        it('should be type string', function() {
                            assert.equal(typeof val.image, 'string');
                        });
                        it('should only contain ascii characters', function() {
                            assert(countNonAscii(val.image) == 0, showNonAscii(val.image));
                        });
                        it('should only contain alphanumeric characters, "." and "-"', function() {
                            assert(verifyCharacters(val.image, /[a-zA-Z0-9\.\-]/));
                        });
                        it('should be unique', function() {
                            assert(countOccurences(val.image, Array.from(cards, x => x.image)) == 1, 'Each image name must only occur once');
                        });
                        it('should follow naming convention', function() {
                            let imageSplit = val.image.split("-");
                            assert(imageSplit.length > 2, 'the image should contain at least 3 sections separated by hyphens(-)');
                            assert(["act", "event"].includes(imageSplit[0]), 'Card must either be activity (act) or event (event) card');
                            assert(["PLAN", "CONTEXT", "IMP", "WRITEUP"].includes(imageSplit[1]), 'The stage must be either plan (PLAN), context (CONTEXT), implementation (IMP), or write-up (WRITEUP)');
                        });
                        it('should point to an existing file', function(done) {
                            fs.access('./resources/images/cards/' + val.image, fs.constants.R_OK, done);
                        });
                    });

                    afterEach('if current test passed', function() {
                        if (this.currentTest) {
                            allPassed = allPassed && (this.currentTest.state === 'passed');
                        }
                      });
                    after('if all Property Tests tests passed', function() {
                        propertiesCorrect = allPassed;
                    });
                });
                describe('Property Cohesion', function() {
                    before(function() {
                        if (!(propertiesExist && propertiesCorrect)) {
                            this.skip();
                        }
                    });
                    it('slug should be prefix of image string', function() {
                        assert.equal(val.slug, val.image.slice(0, val.slug.length));
                    });
                });
            });
        });
    });
    describe('Activity Card Properties', function() {
        activityCards.forEach(function(val, ix, arr) {
            describe(`Card '${val.title}' (${val.slug}) stage ${val.stage}`, function() {
                let propertiesExist = true;
                let propertiesCorrect = true;
                describe('Property Definitions', function() {
                    let allPassed = true;

                    it('should have frequency property', function() {
                        assert.notEqual(typeof val.frequency, 'undefined', 'frequency property is undefined');
                    });
                    it('should have description property', function() {
                        assert.notEqual(typeof val.description, 'undefined', 'description property is undefined');
                    });
                    it('should have connectivity property', function() {
                        assert.notEqual(typeof val.connectivity, 'undefined', 'connectivity property is undefined');
                    });
                    it('should have connectivity.left property', function() {
                        assert.notEqual(typeof val.connectivity.left, 'undefined', 'connectivity.left property is undefined');
                    });
                    it('should have connectivity.right property', function() {
                        assert.notEqual(typeof val.connectivity.right, 'undefined', 'connectivity.right property is undefined');
                    });
                    it('should have connectivity.up property', function() {
                        assert.notEqual(typeof val.connectivity.up, 'undefined', 'connectivity.up property is undefined');
                    });
                    it('should have connectivity.down property', function() {
                        assert.notEqual(typeof val.connectivity.down, 'undefined', 'connectivity.down property is undefined');
                    });

                    afterEach('if current test passed', function() {
                        if (this.currentTest) {
                            allPassed = allPassed && (this.currentTest.state === 'passed');
                        }
                      });
                    after('if all Property Definitions tests passed', function() {
                        propertiesExist = allPassed;
                    });
                });
                describe('Property Tests', function() {
                    let allPassed = true;

                    before('skip if Property Definitions failed', function() {
                        if (!propertiesExist) {
                            this.skip();
                        }
                    });

                    describe('Frequency Property', function() {
                        it('should be type number', function() {
                            assert.equal(typeof val.frequency, 'number');
                        });
                        it('should be non-negative', function() {
                            assert(val.frequency >= 0);
                        });
                        it('should be an integer', function() {
                            assert.equal(Math.round(val.frequency), val.frequency);
                        });
                    });
                    describe('Description Property', function() {
                        it('should be type string', function() {
                            assert.equal(typeof val.description, 'string');
                        });
                        it('should only contain ascii characters', function() {
                            assert(countNonAscii(val.description) == 0, showNonAscii(val.description));
                        });
                    });
                    describe('Connectivity Property', function() {
                        describe('Connectivity.Left Property', function() {
                            it('should be type boolean', function() {
                                assert.equal(typeof val.connectivity.left, 'boolean');
                            });
                        });
                        describe('Connectivity.Right Property', function() {
                            it('should be type boolean', function() {
                                assert.equal(typeof val.connectivity.right, 'boolean');
                            });
                        });
                        describe('Connectivity.Up Property', function() {
                            it('should be type boolean', function() {
                                assert.equal(typeof val.connectivity.up, 'boolean');
                            });
                            if (val.stage == 4) {
                                describe('Last Stage (4)', function() {
                                    it('should not connect upward', function() {
                                        assert(val.connectivity.up == false);
                                    });
                                });
                            }
                        });
                        describe('Connectivity.Down Property', function() {
                            it('should be type boolean', function() {
                                assert.equal(typeof val.connectivity.down, 'boolean');
                            });
                            if (val.stage == 1) {
                                describe('First Stage (1)', function() {
                                    it('should not connect downward', function() {
                                        assert(val.connectivity.down == false);
                                    });
                                });
                            }
                        });
                    });

                    afterEach('if current test passed', function() {
                        if (this.currentTest) {
                            allPassed = allPassed && (this.currentTest.state === 'passed');
                        }
                      });
                    after('if all Property Tests tests passed', function() {
                        propertiesCorrect = allPassed;
                    });
                });
                describe('Property Cohesion', function() {
                    before(function() {
                        if (!(propertiesExist && propertiesCorrect)) {
                            this.skip();
                        }
                    });
                });
            });
        });
    });
    describe('Event Card Properties', function() {
        eventCards.forEach(function(val, ix, arr) {
            describe(`Card '${val.title}' (${val.slug}) stage ${val.stage}`, function() {
                let propertiesExist = true;
                let propertiesCorrect = true;
                describe('Property Definitions', function() {
                    let allPassed = true;

                    it('should have isOptional property', function() {
                        assert.notEqual(typeof val.isOptional, 'undefined');
                    });
                    it('should have effect property', function() {
                        assert.notEqual(typeof val.effect, 'undefined');
                    });
                    it('should have elseCondition property', function() {
                        assert.notEqual(typeof val.elseCondition, 'undefined');
                    });
                    it('should have elseEffect property', function() {
                        assert.notEqual(typeof val.elseEffect, 'undefined');
                    });

                    afterEach('if current test passed', function() {
                        if (this.currentTest) {
                            allPassed = allPassed && (this.currentTest.state === 'passed');
                        }
                      });
                    after('if all Property Definitions tests passed', function() {
                        propertiesExist = allPassed;
                    });
                });
                describe('Property Tests', function() {
                    let allPassed = true;

                    before('skip if Property Definitions failed', function() {
                        if (!propertiesExist) {
                            this.skip();
                        }
                    });

                    describe('IsOptional Property', function() {
                        it('should be type boolean', function() {
                            assert.equal(typeof val.isOptional, 'boolean');
                        });
                    });
                    describe('Effect Property', function() {
                        testEffect(val.effect);
                    });
                    describe('ElseCondition Property', function() {
                        it('should be type string', function() {
                            assert.equal(typeof val.elseCondition, 'string');
                        });
                        it('should only contain ascii characters', function() {
                            assert(countNonAscii(val.elseCondition) == 0, showNonAscii(val.elseCondition));
                        });
                        it('should only contain alphanumeric characters and - ~ { } [ ] ( ) * $ ! ^ & |', function() {
                            assert(verifyCharacters(val.elseCondition, /[a-zA-Z0-9\-\~\{\}\[\]\(\)\*\$\!\^\&\|]/));
                        });
                        if (val.elseCondition.length < 6) {
                            it('should either be true or false', function() {
                                assert(["true", "false"].includes(val.elseCondition));
                            });
                        } else {
                            testLogicFunction(val.elseCondition);
                        }
                    });
                    describe('ElseEffect Property', function() {
                        testEffect(val.elseEffect);
                    });

                    afterEach('if current test passed', function() {
                        if (this.currentTest) {
                            allPassed = allPassed && (this.currentTest.state === 'passed');
                        }
                      });
                    after('if all Property Tests tests passed', function() {
                        propertiesCorrect = allPassed;
                    });
                });
                describe('Property Cohesion', function() {
                    before(function() {
                        if (!(propertiesExist && propertiesCorrect)) {
                            this.skip();
                        }
                    });
                });
            });
        });
    });
    describe('Card Groups', function() {
        Object.entries(cardGroups).forEach(function(val, ix, arr) {
            describe(`Group ${val[0]}`, function() {
                let list: any[] = val[1];
                list.forEach(function(elem, i, array) {
                    if (typeof elem == 'string') {
                        describe(`Card Slug ${elem}`, function() {
                            it('should be an actual slug', function() {
                                assert(cardSlugs.has(elem));
                            });
                        });
                    } else {
                        describe('Generator function', function() {
                            let f: Function;
                            let result: any[];
                            it('should have function property', function() {
                                assert.notEqual(typeof elem.activityCardFilter, 'undefined');
                                assert.notEqual(typeof elem.eventCardFilter, 'undefined');
                            });
                            it('should have function body of type string', function() {
                                assert.equal(typeof elem.activityCardFilter, 'string');
                                assert.equal(typeof elem.eventCardFilter, 'string');
                            });
                            it('should run as a function', function() {
                                f = new Function("activityCards,eventCards", `return activityCards.filter(function(card){return ${elem.activityCardFilter}}).concat(eventCards.filter(function(card){return ${elem.eventCardFilter}}))`);
                                result = f(activityCards, eventCards);
                            });
                            it('should return an array', function() {
                                assert(result instanceof Array);
                            });
                            it('should return at least one slug', function() {
                                assert(result.length > 0);
                            });
                        });
                    }
                });
            });
        });
    });
});


// ================================================================================================


function testEffect(value: string) {
    it('should be type string', function() {
        assert.equal(typeof value, 'string');
    });
    it('should only contain ascii characters', function() {
        assert(countNonAscii(value) == 0, showNonAscii(value));
    });
    it('should only contain alphanumeric characters and - ~ { } [ ] ( ) * $ ! ^ & | SPACE', function() {
        assert(verifyCharacters(value, /[a-zA-Z0-9\-\~\{\}\[\]\(\)\*\$\!\^\&\| ]/));
    });
    it('should have bracket closure (matching bracket pairs and correct nesting)', function() {
        assert(verifyBracketClosure(value));
    });
    it('should parse without errors', function() {
        parseEffect(value);
    });
    it('should only use actual card slugs and groups', function() {
        testCardExistence(value);
    });
}

function testLogicFunction(logicFunction: string) {
    it('should have bracket closure (matching bracket pairs and correct nesting)', function() {
        assert(verifyBracketClosure(logicFunction));
    });
    it('should parse without errors', function() {
        parseLogicFunction(logicFunction);
    });
    it('should only use actual card slugs and groups', function() {
        testCardExistence(logicFunction);
    });
}

function testCardExistence(expression: string) {
    let offset = 0;
    while (expression.indexOf(LOGIC_BRACKET_CARD_OPEN, offset) >= 0) {
        let openIndex = expression.indexOf(LOGIC_BRACKET_CARD_OPEN, offset);
        let closeIndex = expression.indexOf(LOGIC_BRACKET_CARD_CLOSE, openIndex);
        let slice = expression.slice(openIndex+1, closeIndex)
        assert(isCardStatement(slice), `Invalid card statement '${slice}'`);
        if (isCardGroup(slice)) {
            let groupSlice = slice.slice(1, slice.length);
            console.log(groupSlice);
            assert(Object.keys(cardGroups).includes(groupSlice), `Could not find card group '${slice}'`);
        } else if (isCardSlug(slice)) {
            assert(cardSlugs.has(slice), `Could not find card slug '${slice}'`);
        } else {
            throw `Fatal error: '${slice}' is card statement but neither a card group nor card slug`;
        }
        offset = closeIndex;
    }
}