const Params = imports.misc.params;

let DefaultSettings = {
    "aws_cli_profile" : "",
    "aws_filter_tag_value" : "",
    "ssh_username" : "",
    "ssh_key" : "",
    "bastion_host" : "",
    "forward_ssh_agent" : "false"
};

function getSettingsJSON(settings) {
    if (settings === undefined || settings.get_string("settings-json") === undefined || settings.get_string("settings-json").length === 0) {
        return DefaultSettings;
    }

    let settingsJSON;
    try {
        settingsJSON = JSON.parse(settings.get_string("settings-json"));
        settingsJSON = settingsJSON || DefaultSettings;
    } catch (e) {
        settingsJSON = DefaultSettings;
    }
    return settingsJSON;
}