// ==UserScript==
// @name Neverwinter gateway - sca ROLLS
// @description Automatically runs SCA non-stop stripped by RM
// @namespace https://greasyfork.org/scripts/7061-neverwinter-gateway-professions-robot/
// @include http://gateway*.playneverwinter.com/*
// @include https://gateway*.playneverwinter.com/*
// @include http://gateway.*.perfectworld.eu/*
// @include https://gateway.*.perfectworld.eu/*
// @originalAuthor https://github.com/LaskonSoftware
// @version 5555.00SCA proto
// @license https://github.com/LaskonSoftware/NWGatewayAutomation/blob/master/LICENSE
// ==/UserScript==

/*This pulls all the requisite files, but files are pulled allready*/
 // /*@Require http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js , not needed*/
/*
https://rawgithub.com/LaskonSoftware/NWGatewayAutomation/master/src2/NeverwinterGateway.js
https://rawgithub.com/KanbanSolutions/Math.uuid.js/master/Math.uuid.js
https://rawgithub.com/LaskonSoftware/NWGatewayAutomation/master/src/js/taskPromise.js
https://rawgithub.com/LaskonSoftware/NWGatewayAutomation/master/src2/switchToCharacter.js
https://rawgithub.com/LaskonSoftware/NWGatewayAutomation/master/src2/professionTask.js
https://rawgithub.com/LaskonSoftware/NWGatewayAutomation/master/src2/swordCoastAdventureTask.js
https://rawgithub.com/LaskonSoftware/NWGatewayAutomation/master/src2/dicePickerBrain.js
https://rawgithub.com/LaskonSoftware/NWGatewayAutomation/master/src2/dicePickerTask.js*/

var sca_character;
sca_character = "my fancy non_stop sca runner"; //change character names here, you must be on gateway and most cases on character.

//Newerwinter Gateway sca
MAIN(sca_character);
function MAIN(sca_run_non_stop_character) {
//NewerwinterGateway.js
    var character = {
        name: sca_run_non_stop_character,
        assignments: {
            filter: {
                sort: 'asc|desc',
                hide_abovelevel: true || false,
                hide_unmetreqs: true || false
            },
            todo: [],
            tasks: {
                leadership: [],
                leatherworking: [],
                tailoring: [],
                mailsmithing: [],
                platesmithing: [],
                artificing: [],
                weaponsmithing: [],
                alchemy: []
            }
        }
    };

    $.extend(true, {nwg: {}});//NewerwinterGateway.js



//taskPromise.js
    //$.getScript("https://rawgithub.com/KanbanSolutions/Math.uuid.js/master/Math.uuid.js");
    /*!
     Math.uuid.js (v1.4)
     http://www.broofa.com
     mailto:robert@broofa.com

     Copyright (c) 2010 Robert Kieffer
     Dual licensed under the MIT and GPL licenses.
     */

    /*
     * Generate a random uuid.
     *
     * USAGE: Math.uuid(length, radix)
     *   length - the desired number of characters
     *   radix  - the number of allowable values for each character.
     *
     * EXAMPLES:
     *   // No arguments  - returns RFC4122, version 4 ID
     *   >>> Math.uuid()
     *   "92329D39-6F5C-4520-ABFC-AAB64544E172"
     *
     *   // One argument - returns ID of the specified length
     *   >>> Math.uuid(15)     // 15 character ID (default base=62)
     *   "VcydxgltxrVZSTV"
     *
     *   // Two arguments - returns ID of the specified length, and radix. (Radix must be <= 62)
     *   >>> Math.uuid(8, 2)  // 8 character ID (base=2)
     *   "01001010"
     *   >>> Math.uuid(8, 10) // 8 character ID (base=10)
     *   "47473046"
     *   >>> Math.uuid(8, 16) // 8 character ID (base=16)
     *   "098F4D35"
     */
    (function () {
        // Private array of chars to use
        var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

        Math.uuid = function (len, radix) {
            var chars = CHARS, uuid = [], i;
            radix = radix || chars.length;

            if (len) {
                // Compact form
                for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
            } else {
                // rfc4122, version 4 form
                var r;

                // rfc4122 requires these characters
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';

                // Fill in random data.  At i==19 set the high bits of clock sequence as
                // per rfc4122, sec. 4.1.5
                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random() * 16;
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }

            return uuid.join('');
        };

        // A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
        // by minimizing calls to random()
        Math.uuidFast = function () {
            var chars = CHARS, uuid = new Array(36), rnd = 0, r;
            for (var i = 0; i < 36; i++) {
                if (i == 8 || i == 13 || i == 18 || i == 23) {
                    uuid[i] = '-';
                } else if (i == 14) {
                    uuid[i] = '4';
                } else {
                    if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
                    r = rnd & 0xf;
                    rnd = rnd >> 4;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
            return uuid.join('');
        };

        // A more compact, but less performant, RFC4122v4 solution:
        Math.uuidCompact = function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };
    })();
    var Task = function (start_method, call_args) {
        this.id = Math.uuidFast();// https://github.com/KanbanSolutions/Math.uuid.js
        this.steps = [];
        this.then(start_method, call_args);
        this.finished = false;
    };

    Task.prototype.then = function (step_method, call_args) {
        //console.log("then: " + call_args);
        var defered = $.Deferred();
        defered.then(this.Step(step_method, call_args));
        this.steps.push(defered);

        return this;
    };

    Task.prototype.insert = function (step_method, call_args) {
        //console.log("then: " + call_args);
        var defered = $.Deferred();
        defered.then(this.Step(step_method, call_args));
        this.steps.splice(1, 0, defered);

        return this;
    };

    Task.prototype.Step = function (step_method, call_args) {
        var self = this;
        var wrap = function () {
            var args = call_args || [];
            //console.log("wrap for " + self.id);

            if (!args.length && arguments.length) {
                args = [].slice.call(arguments);
            }

            if (!$.isArray(args)) {
                args = $.makeArray(args);
            }
            args.push(self);
            var results = step_method.apply(self, args);
            if (this.finished) return;

            var delay = results === undefined || results.delay === undefined ? 0 : results.delay;

            //console.log("[results=" + results + "] [steps.length=" + this.steps.length + "]");
            if (results === undefined && self.steps.length === 0) {
                /*
                 I don't know why I need to bounce out here, it fails if I don't.
                 */
                //console.log("exiting on thingy");
                return;
            }
            if (results !== undefined && results.error) {
                //console.log("retry needed");
                self.retry.call(self, delay, step_method, args);
            } else {
                //console.log("no retry needed");
                if (!results) results = {};
                //console.log('promise: ' + call_args);
                //console.log('promise: ' + args);
                args = results.args || [];
                args.unshift(delay);
                self.steps.shift();
                self.progress.apply(self, args);
            }
        };
        return wrap;
    };

    Task.prototype.retry = function (delay, step_method, args) {
        //console.log("retry");
        this.steps.shift();
        var defered = $.Deferred();
        defered.then(this.Step(step_method, args));
        this.steps.unshift(defered);

        this.progress(delay);

        return this;
    };

    Task.prototype.progress = function (delay) {
        if (!delay) {
            delay = 0;
        }
        var args = [].slice.call(arguments);
        var self = this;
        //Moving from progress
        if (!($.task.executing === self.id || $.task.executing === null)) {
            setTimeout(function () {
                self.progress.apply(self, args);
            }, Math.max(delay, 3000));
            return;
        }
        $.task.executing = this.id;
        args.shift();


        var execute = function () {
            //console.log("execute");
            if (!self.steps.length) {
                self.finish();
                return;
            }
            var defered = self.steps[0];
            defered.resolve.apply(null, args);
        }

        if (delay > 0) {
            setTimeout(execute, delay);
        } else {
            requestAnimationFrame(execute);
        }

        return this;
    };

    Task.prototype.start_in = function (delay) {
        if (!delay) {
            delay = 0;
        }
        var args = [].slice.call(arguments);
        var self = this;
        args.shift(); //remove the delay from the args

        setTimeout(function () {
            self.progress.apply(self, args);
        }, delay);

        return this;
    }

    Task.prototype.finish = function () {
        //console.log("finish");
        var self = this;
        this.steps = [];
        $.task.executing = null;
        this.finished = true;
        requestAnimationFrame(function () {
            delete self;
        });
    };


    $.extend(true, {
        task: {
            create: function (start_method, call_args) {
                return new Task(start_method, call_args);
            },
            executing: null
        }
    });
//taskPromise.js

//switchToCharacter.js

    var ChangeToCharacter = function (character) {
        this.characterName = character.name;
    };

    ChangeToCharacter.prototype.activate = function activate(task) {
        if (!this.isActiveCharacter()) {
            task.insert(this.openSelector.bind(this));
            task.insert(this.selectCharacter.bind(this));
        }
        else {
            //console.log(this.characterName + " is currently active");
        }

        return {
            error: false,
            delay: 100
        };
    };

    ChangeToCharacter.prototype.openSelector = function openSelector() {
        var changeCharacterText = 'Change Character'
        $('a:contains(' + changeCharacterText + ')').trigger('click');

        return {
            error: false,
            delay: 1000
        };
    };

    ChangeToCharacter.prototype.selectCharacter = function selectCharacter() {
        var self = this;
        $('a > h4.char-list-name:contains(' + this.characterName + ')').trigger('click');

        return {
            error: false,
            delay: 1000
        };
    };

    ChangeToCharacter.prototype.isActiveCharacter = function isActiveCharacter() {
        return $('.name-char:contains(' + this.characterName + ')').length > 0
    };

    $.extend(true, $.nwg, {
        changeCharacter: {
            create: function (character) {
                return new ChangeToCharacter(character);
            }
        }
    });
//switchToCharacter.js

//professionTask.js, section stripped off
//
// professionTask.js, section stripped off


//swordCoastAdventureTask.js

    var data = {
        state: {
            isOverWorld: function () {
                return $('.overworld-locations').is(':visible');
            },
            isChooseParty: function () {
                return $('.page-dungeon-chooseparty').is(':visible');
            },
            isAdventure: function () {
                return $('.dungeon-map-inner').is(':visible') && !$('.modal-window').is(':visible');
            },
            isSelectEncounterCompanion: function () {
                return $('.encounter-party-list').is(':visible');
            },
            isEncounter: function () {
                return $('.page-dungeon-combat').is(':visible') &&
                    (!$('.modal-window').is(':visible') ||
                    $('.modal-confirm.combat-wild > h3:contains(' + data.text.criticalHit + ')').is(':visible'));
            },
            isDiceRoller: function () {
                return $('.combatDiceBox').is(':visible') && !$('.modal-window').is(':visible');
            },
            isCombatVictory: function () {
                return $('.modal-confirm.combat-victory').is(':visible');
            },
            isModal: function () {
                return $('.modal-window').is(':visible');
            }
        },
        text: {
            chooseYourParty: 'Choose Your Party',
            ok: 'OK',
            d20: 'D20',
            criticalHit: 'Critical Hit!'
        }
    };


    var Adventure = function (character) {

        this.character = character;
        this.changeCharacter = $.nwg.changeCharacter.create(this.character);
        this.adventures = this.character.adv;
        this.dicePicker = $.nwg.dicePicker.create(this.character, $.nwg.dicePickerBrain.create());
    };

    Adventure.prototype.make_adventure_active = function (task) {
        $('.nav-dungeons').trigger('click');
        return {
            error: false,
            delay: 3000
        };
    };

    Adventure.prototype.check_adventure_state = function (task) {
        //console.log("check_adventure_state");
        //var task = self.crete_base_task();
        /*
         Should only be called from the crate_base_task method
         */

        if (data.state.isOverWorld()) {
            //console.log("isOverWorld");
            task.then(this.start_adventure.bind(this))
            task.then(this.confirm_adventure.bind(this));
        }
        else if (data.state.isChooseParty()) {
            //console.log("isChooseParty");
            task.then(this.clear_adventure_party.bind(this));
            task.then(this.select_adventure_party.bind(this));
            task.then(this.comfirm_adventure_party.bind(this));
        }
        else if (data.state.isAdventure()) {
            //console.log("isAdventure");
            task.then(this.select_encounter.bind(this));
        }
        else if (data.state.isEncounter()) {
            //console.log("isEncounter");
            task.then(this.dicePicker.pick_die.bind(this.dicePicker));
            //task.then(this.clear_modal.bind(this));
            task.then(this.check_adventure_state.bind(this));
        }
        else if (data.state.isSelectEncounterCompanion()) {
            //console.log("isSelectEncounterCompanion");
            task.then(this.select_encounter_companion.bind(this));
        }
        else if (data.state.isCombatVictory()) {
            //console.log("isCombatVictory");
            task.then(this.clear_modal.bind(this));
            task.then(this.check_adventure_state.bind(this));
        }
        else if (data.state.isModal()) {
            //console.log("isModal");
            task.then(this.clear_modal.bind(this));
            task.then(this.check_adventure_state.bind(this));
        }
        //else

        return {error: false, delay: 3000};
    };


    Adventure.prototype.start_adventure = function (task) {
        //console.log("start_adventure");
        var curTier = this.adventures[0].tier;
        //console.log("Running " + curTier);
        $('a.' + curTier).trigger('click');

        return {
            error: false,
            delay: 3000
        };
    };

    Adventure.prototype.confirm_adventure = function (task) {
        //console.log("confirm_adventure");
        $('.choosePartyButton > button:contains(' + data.text.chooseYourParty + ')').trigger('click');


        var new_task = this.create_base_task();
        new_task.start_in(1000);

        task.finish();
    };

    Adventure.prototype.select_adventure_party = function (task) {
        //console.log("select_adventure_party");
        //select adventure party member (which attemps to cancel the confirm if up THEN clears THEN selects)
        var PARTY_SIZE = 4;
        var adventureCompanions = this.adventures[0].companions;
        var self = this;
        var companionsToSelect = [];

        var requiredCompanions = [];
        var optionalCompanions = [];
        var totalCompanionCount = $('.party-entry.full-sheet:not(.promo)').length;
        var disabledCount = $('.party-entry.full-sheet.disabled:not(.training)').length;
        var trainingCount = $('.party-entry.full-sheet.training').length;
        var maxAvailableCount = totalCompanionCount - disabledCount;
        var availableCompanions = $('.party-entry.full-sheet.available:not(.promo)>a:not(.selected)');

        //console.log("available party");
        //console.log(availableCompanions);
        //console.log("total: " + totalCompanionCount);
        //console.log("disabled: " + disabledCount);
        //console.log("training: " + trainingCount);
        //console.log("maxAvailable: " + maxAvailableCount);
        if (adventureCompanions && adventureCompanions.length > 0 &&
            totalCompanionCount > PARTY_SIZE && maxAvailableCount > PARTY_SIZE) {
            //console.log("many available");

            $(availableCompanions).each(function (indx, aCmp) {
                var availableCompanion = $(aCmp);
                var matched = false;
                $(adventureCompanions).each(function (indx, cmp) {
                    var companion = availableCompanion.has(':contains(' + cmp.name + ')');
                    if (companion.length === 1) {
                        matched = true;
                        if (cmp.required) {
                            requiredCompanions.unshift(companion);
                        }
                        else if (!cmp.excluded) {
                            optionalCompanions.unshift(companion);
                        }
                    }

                });
                if (!matched) {
                    optionalCompanions.push(availableCompanion);
                }
                //console.log("rC=" + requiredCompanions.length + " | oC=" + optionalCompanions.length);
            });


            if (requiredCompanions.length + optionalCompanions.length >= PARTY_SIZE) {

                for (var i = 0; i < requiredCompanions.length && i < PARTY_SIZE; i++) {
                    companionsToSelect.push($(requiredCompanions[i]));
                }

                for (var ii = 0; ii < optionalCompanions.length && ii < PARTY_SIZE && ii < PARTY_SIZE - requiredCompanions.length; ii++) {
                    companionsToSelect.push($(optionalCompanions[ii]));
                }

            }
        }
        else if ((totalCompanionCount <= PARTY_SIZE && disabledCount === 0) ||
            (maxAvailableCount >= PARTY_SIZE)) {
            //console.log("available compansions are all");
            companionsToSelect = availableCompanions;
        }

        if (companionsToSelect.length > 0) {
            for (var i = 0; i < companionsToSelect.length && i < PARTY_SIZE; i++) {
                $(companionsToSelect[i]).trigger('click');
            }
        }
        else {
            //console.log("Not enough compansions available")
            var delay = this.get_delay();

            var new_task = this.create_base_task();
            new_task.then(this.back_to_map.bind(this));
            new_task.start_in(delay);

            //Go to the next adventure group

            task.finish();
            return;
        }

        return {error: false, delay: 2000};
    };

    Adventure.prototype.back_to_map = function (task) {
        $('a.chooseparty-back').trigger('click');
        return {error: false, delay: 2000};
    };

    Adventure.prototype.clear_adventure_party = function (task) {
        //console.log("clear_adventure_party");
        var partyCloseButtons = $('.party-entry > button.close-button');
        partyCloseButtons.each(function (idx, btn) {
            $(btn).trigger('click');
        });

        return {
            error: false,
            delay: 1000
        };
    };

    Adventure.prototype.comfirm_adventure_party = function (task) {
        //console.log("comfirm_adventure_party");
        $('.modal-window  button:contains(' + data.text.ok + ')').trigger('click');


        task.then(this.start_new.bind(this));

        return {
            error: false,
            delay: 1000
        };
    };

    Adventure.prototype.start_new = function (old_task) {

        var new_task = this.create_base_task();
        new_task.start_in(1000);

        old_task.finish();
    }

    Adventure.prototype.select_encounter = function (task) {
        //console.log("select_encounter");
        if ($('.dungeon-map-inner').length === 0) {
            //console.log("Dungeon not ready");
            return {
                error: false,
                delay: 1000
            };
        }
        var encounters = $('.overlay.button:not(.complete, .exit, .boss, .stairs-down, .stairs-up)');
        var stairsDown = $('.overlay.button.stairs-down');
        var boss = $('.overlay.button.boss');
        var exit = $('.overlay.button.exit');
        var stairsUp = $('.overlay.button.stairs-up');
        var oneHealthPx = parseInt($('.bar-tick-container > .bar-tick').eq(0).css('left')) + 2;// 2 for safety
        var curHealthPx = parseInt($('.bar-filled.health-now').css('width'));

        var encounter = undefined;
        //console.log("[oneHealthPx=" + oneHealthPx + "] [curHealthPx=" + curHealthPx + "]");
        if (oneHealthPx >= curHealthPx) {//We don't want to lose out lewts; bail.
            if (stairsUp.length > 0) {
                encounter = stairsUp.eq(0);
            }
            else if (exit.length > 0) {
                encounter = exit.eq(0);
                task.then(this.clear_modal);//OK Exit
                task.then(this.clear_modal);//Accept Rewards
            }
            task.then(this.start_new.bind(this));
        }
        else {
            if (encounters.length > 0) {
                encounter = encounters.eq(0);
            }
            else if (stairsDown.length > 0) {
                encounter = stairsDown.eq(0);
            }
            else if (boss.length > 0) {
                encounter = boss.eq(0);
            }
            task.then(this.select_encounter_companion.bind(this));
        }

        encounter.trigger('click');

        return {
            error: false,
            delay: 1000
        };
    };

    Adventure.prototype.select_encounter_companion = function (task) {
        //console.log("select_encounter_companion");
        var companions = $('a.selectable');
        if (companions.length >= 1) {
            $('a.selectable').eq(0).trigger('click');
        }
        ;

        var new_task = this.create_base_task();
        new_task.start_in(1000);

        task.finish();
    };

    Adventure.prototype.clear_modal = function (task) {
        var m = $('.modal-window');

        var okBtn = m.find('button:contains(' + data.text.ok + ')')
        var d20Btn = m.find('button:contains(' + data.text.d20 + ')');

        if (okBtn.length === 1) {
            okBtn.trigger('click');
        }
        if (d20Btn.length === 1) {
            d20Btn.trigger('click');
        }

        return {
            error: false,
            delay: 1000
        };
    };

    Adventure.prototype.get_delay = function (task) {

        var availableCompanions = $('.party-entry.full-sheet.available:not(.promo)>a:not(.selected)');
        if (availableCompanions.length >= 4) {
            //The idea here is that SOME set might have the ability to run, so we need to try
            return 60 * 1000;//in a minute
        }
        var reqStam = $('.chooseparty-stamina .number').eq(0).text();
        var belowStamComp = $('.party-entry.full-sheet.disabled .party-stamina')

        belowStamComp.sort(function (l, r) {
            return (parseInt($(l).find('.below').text()) || 0) < (parseInt($(r).find('.below').text()) || 0);
        });//Sorts lowest first

        var stamDown = belowStamComp.eq(0).text().trim();
        var missing = reqStam - stamDown;
        if (missing <= 0) {
            return 0;
        }
        var regenDelay = ((((missing - 1) * 8) + 1) * 60 * 1000);//Check in minutes if there's enough stamina

        var d = new Date();
        d.setMilliseconds(d.getMilliseconds() + regenDelay);
        console.log("[Sword Coast Adventure for " + this.character.name + " delayed for "
        + regenDelay + " ms at " + new Date().toLocaleString()
        + " resuming at " + d.toLocaleString());

        return regenDelay;
    };

    Adventure.prototype.create_base_task = function create_base_task() {
        //console.log("create_base_task");
        var self = this;
        var task = $.task.create(self.changeCharacter.activate.bind(this.changeCharacter));
        task.then(self.make_adventure_active.bind(self));
        task.then(self.check_adventure_state.bind(self));

        return task;
    };


    $.extend(true, $.nwg, {
        adventure: {
            create: function (character) {
                return new Adventure(character);
            }
        }
    });
//swordCoastAdventureTask.js


//dicePickerTask.js

    var DicePicker = function (character, brain) {
        this.brain = brain;
        this.character = character;
        this.rolling_ctr = 0;
    };

    DicePicker.prototype.pick_die = function (task) {
        //console.log("pick_die");
        if (this.is_rolling()) {
            //console.log("is_rolling");

            //Add a check to not wait more than 10 times; instead end the task, start a new SCA task
            //This will prevent getting stuck on the dice rolling screen, as has happened.
            if (this.rolling_ctr++ > 10) {

                return {
                    error: false,
                    delay: 1000
                };
            }

            return {
                error: true,
                delay: 500 * this.rolling_ctr + 500
            };
        }

        var die = this.brain.find_die();

        if (!die) {
            //console.log("no die");

            return {
                error: false,
                delay: 1000
            }
        }

        die.trigger('click');

        task.insert(this.pick_die.bind(this));

        return {
            error: false,
            delay: 1000
        };
    };


    DicePicker.prototype.is_rolling = function () {
        return $('.combatDiceBox').is(':visible') && !$('.modal-window').is(':visible');
    };


    $.extend(true, $.nwg, {
        dicePicker: {
            create: function (character, brain) {
                return new DicePicker(character, brain);
            }
        }
    });
//dicePickerTask.js


//dicePickerBrains.js

    var DicePickerBrain = function () {
    };

    DicePickerBrain.prototype.find_die = function () {
        if (this.is_critical()) {
            return this.find_critical_die();
        }

        return this.find_tray_die();
    };

    DicePickerBrain.prototype.find_tray_die = function () {
        var diceTray = $('.dice-tray-helper');
        var use = diceTray.find('.dice.usable');
        var disacard = diceTray.find('.dice.discardable');

        if (use.length > 0) {
            var max = 0;
            var idx = -1;
            use.sort(function (a, b) {
                return (parseInt($(a).find('.num').text()) || 0) < (parseInt($(b).find('.num').text()) || 0);
            });
            return use.eq(0)
        } else if (disacard.length > 0) {
            return disacard.eq(0);
        }

        //console.log("no die found");
        return undefined;
    };

    DicePickerBrain.prototype.find_critical_die = function () {
        return $('.modal-confirm.combat-wild a.dice.usable').eq(0);
    };


    DicePickerBrain.prototype.is_critical = function () {
        return $('.modal-confirm.combat-wild').is(':visible');
    };

    $.extend(true, $.nwg, {
        dicePickerBrain: {
            create: function () {
                return new DicePickerBrain();
            }
        }
    });
//dicePickerBrains.js

//This is my character definition, just change "my character name", on Gateway make sure you are on character and turn off Buntas Bot, save and F5....
    var thor = {
        name: sca_run_non_stop_character,
        assignments: {
            filter: {
                sort: 'desc',
                hide_abovelevel: true,
                hide_unmetreqs: true
            },
            tasks: {
                leadership: [],
                tailoring: [],
                artificing: []
            },
            todo: []
        },
        adv: [{
            tier: 'tier-3',
            companions: []
        }
        ]
    };

//This starts the profession, stripped off

//This starts the adventure

    var profTask = $.nwg.adventure.create(thor);
    var task = profTask.create_base_task();
    task.progress();
}
