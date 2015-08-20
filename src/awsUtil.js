const Me = imports.misc.extensionUtils.getCurrentExtension();
const GLib = imports.gi.GLib;

function listInstances(settings) {
    if (settings['aws_filter_tag_value'].length === 0) {
        return undefined;
    }
    let filterValue  = settings['aws_filter_tag_value'];

    let [res, out, err, status] = GLib.spawn_command_line_sync("aws --profile "+settings['aws_cli_profile']+" ec2 describe-instances --output json --filters Name=tag:Name,Values="+filterValue+" --query 'Reservations[*].Instances[*].{PublicIp:PublicIpAddress, PrivateIp:PrivateIpAddress, Tag:Tags, InstanceId:InstanceId,State:State.Name}'");

    if (status !== 0) {
        throw err;
    }
    let jsonResponse = JSON.parse(out.toString());
    jsonResponse.sort(function(a,b) { return findTag(a, "Name").localeCompare(findTag(b, "Name")) } );
    return jsonResponse;
}

function terminateInstance(instanceId, settingsJSON) {
    if (instanceId) {
        global.log("Terminating instance " + instanceId);
        let [res, out, err, status] = GLib.spawn_command_line_sync("aws --profile " + settingsJSON['aws_cli_profile'] + " ec2 terminate-instances --output json --instance-ids " + instanceId);
        return res;
    } else {
        global.log("Unable to terminate instanceId, no instanceId value");
        return false;
    }
}

function findTag(ec2Instance, key) {
    for (var i = 0; i < ec2Instance[0]['Tag'].length; i++) {
        if (ec2Instance[0]['Tag'][i]['Key'] == key) {
            return ec2Instance[0]['Tag'][i]['Value'];
        }
    }
    return null;
}