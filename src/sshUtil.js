const Gio = imports.gi.Gio;
const Util = imports.misc.util;

function connect(command, environment) {
    var file = Gio.File.new_for_path('/usr/bin/guake');
    if (!file.query_exists(null)) {
        Util.spawn(['gnome-terminal', '-e', command])
    } else {
        Util.spawn(['/usr/bin/guake', '-n', 'instance', '--rename-current-tab', environment, '-e', command, '--show']);
    }
}