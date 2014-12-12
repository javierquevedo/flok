var config = {
    registerRouter: true,
    registerLocale: true,
    registerAngularModule: true,
    registerPublicFiles: true,
    jsFiles: [
        'app/time/flokTimeModule.js',
        'app/time/Task.js',
        'app/time/taskService.js',
        'app/time/TimeCtrl.js',
        'app/time/backendStorageService.js',
        'app/time/durationUtil.js'
    ]
};

module.exports = config;
