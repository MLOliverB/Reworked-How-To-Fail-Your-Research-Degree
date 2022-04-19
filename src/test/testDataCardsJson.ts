import { countNonAscii, countOccurences, showNonAscii } from "./util";

var fs = require('fs');
var assert = require('assert');
var activityCards: any[] = require('../../resources/data/activity-cards');
var eventCards: any[] = require('../../resources/data/event-cards');
var cards: any[] = activityCards.concat(eventCards);
var cardGroups: any[] = require('../../resources/data/activity-cards');

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
                        it('should be type string', function() {
                            assert.equal(typeof val.effect, 'string');
                        });
                        it('should only contain ascii characters', function() {
                            assert(countNonAscii(val.effect) == 0, showNonAscii(val.effect));
                        });
                    });
                    describe('ElseCondition Property', function() {
                        it('should be type string', function() {
                            assert.equal(typeof val.elseCondition, 'string');
                        });
                        it('should only contain ascii characters', function() {
                            assert(countNonAscii(val.elseCondition) == 0, showNonAscii(val.elseCondition));
                        });
                    });
                    describe('ElseEffect Property', function() {

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
        
    });
});