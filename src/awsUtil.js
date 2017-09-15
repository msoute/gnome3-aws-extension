const Me = imports.misc.extensionUtils.getCurrentExtension();
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;

let out_reader;
let asyncCall;

let resultJson = "";

function listInstances(settings, callback) {
    asyncCall = callback;
    if (settings['aws_filter_tag_value'].length === 0) {
        return undefined;
    }
    let filterValue = settings['aws_filter_tag_value'];

    let array = ['/usr/bin/aws', '--profile', settings['aws_cli_profile'], 'ec2', 'describe-instances', '--output', 'json', '--filters', "Name=tag:Name,Values=" + filterValue, '--query', 'Reservations[*].Instances[*].{PublicIp:PublicIpAddress, PrivateIp:PrivateIpAddress, Tag:Tags, InstanceId:InstanceId,State:State.Name}'];

    resultJson = "";
    let [res_async, pid, in_fd, out_fd, err_fd] = GLib.spawn_async_with_pipes(null, array, null, 0, null);
    out_reader = new Gio.DataInputStream({
        base_stream: new Gio.UnixInputStream({fd: out_fd})
    });
    out_reader.read_upto_async("", 0, 0, null, _SocketRead, "");
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

function _SocketRead(source_object, res) {
    const [out, length] = out_reader.read_upto_finish(res);
    if (length > 0) {
        resultJson = resultJson + out;
        out_reader.read_upto_async("", 0, 0, null, _SocketRead, "");
    } else {
        let jsonResponse = JSON.parse(resultJson);
        jsonResponse.sort(function (a, b) {
            asyncCall(findTag(a, "Name").localeCompare(findTag(b, "Name")));
            //return findTag(a, "Name").localeCompare(findTag(b, "Name"))
        });
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