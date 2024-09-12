/// use logger.log instead of console.log
// --------------------- CONFIG ---------------------
const loggerConfig = {
    active: true, // <-- GLOBAL CONSOLE OUTPUT SETTING
    doAssert: true,
    doClear: true,
    doCount: true,
    doCountReset: true,
    doDebug: true,
    doDir: true,
    doDirxml: true,
    doError: true,
    doGroup: true,
    doInfo: true,
    doLog: true,
    doTable: true,
    doTime: true,
    doTrace: true,
    doWarn: true,
    doSetting: true,
    doFile: true,
    doDEVMODE: true
};
// ------------------------------------------------------

const logger = {
    assert: function () {
        if (loggerConfig.active && loggerConfig.doAssert) {
            console.assert.apply(null, arguments);
        }
    },
    clear: function () {
        if (loggerConfig.active && loggerConfig.doClear) {
            console.clear();
        }
    },
    count: function () {
        if (loggerConfig.active && loggerConfig.doCount) {
            console.count.apply(null, arguments);
        }
    },
    countReset: function () {
        if (loggerConfig.active && loggerConfig.doCountReset) {
            console.countReset.apply(null, arguments);
        }
    },
    debug: function () {
        if (loggerConfig.active && loggerConfig.doDebug) {
            console.debug.apply(null, arguments);
        }
    },
    dir: function () {
        if (loggerConfig.active && loggerConfig.doDir) {
            console.dir.apply(null, arguments);
        }
    },
    dirxml: function () {
        if (loggerConfig.active && loggerConfig.doDirxml) {
            console.dirxml.apply(null, arguments);
        }
    },
    error: function () {
        if (loggerConfig.active && loggerConfig.doError) {
            console.error.apply(null, arguments);
        }
    },
    group: function () {
        if (loggerConfig.active && loggerConfig.doGroup) {
            console.group.apply(null, arguments);
        }
    },
    groupCollapsed: function () {
        if (loggerConfig.active && loggerConfig.doGroup) {
            console.groupCollapsed.apply(null, arguments);
        }
    },
    groupEnd: function () {
        if (loggerConfig.active && loggerConfig.doGroup) {
            console.groupEnd.apply(null, arguments);
        }
    },
    info: function () {
        if (loggerConfig.active && loggerConfig.doInfo) {
            console.info.apply(null, arguments);
        }
    },
    log: function () {
        if (loggerConfig.active && loggerConfig.doLog) {
            console.log.apply(null, arguments);
        }
    },
    files: function () {
        if (loggerConfig.active && loggerConfig.doFile) {
            console.log.apply(null, arguments);
        }
    },
    settings: function () {
        if (loggerConfig.active && loggerConfig.doSetting) {
            console.log.apply(null, arguments);
        }
    },
    table: function () {
        if (loggerConfig.active && loggerConfig.doTable) {
            console.table.apply(null, arguments);
        }
    },
    time: function () {
        if (loggerConfig.active && loggerConfig.doTime) {
            console.time.apply(null, arguments);
        }
    },
    timeEnd: function () {
        if (loggerConfig.active && loggerConfig.doTime) {
            console.timeEnd.apply(null, arguments);
        }
    },
    timeLog: function () {
        if (loggerConfig.active && loggerConfig.doTime) {
            console.timeLog.apply(null, arguments);
        }
    },
    trace: function () {
        if (loggerConfig.active && loggerConfig.doTrace) {
            console.trace.apply(null, arguments);
        }
    },
    warn: function () {
        if (loggerConfig.active && loggerConfig.doWarn) {
            console.warn.apply(null, arguments);
        }
    },
    devmode: function () {
        if (loggerConfig.active && loggerConfig.doDEVMODE) {
            console.warn.apply(null, arguments);
        }
    }
};
