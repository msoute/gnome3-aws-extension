const Params = imports.misc.params;

let DefaultSettings = {
    "aws_cli_profile" : "",
    "aws_filter_tag_value" : "",
    "ssh_username" : "",
    "ssh_key" : ""
}

function getSettingsJSON(settings) {
    let settingsJSON = JSON.parse(settings.get_string("settings-json"));
    settingsJSON = settingsJSON || DefaultSettings;
    return settingsJSON;
}