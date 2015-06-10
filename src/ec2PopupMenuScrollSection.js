const Lang = imports.lang;
const St = imports.gi.St;
const Gtk = imports.gi.Gtk;
const PopupMenu = imports.ui.popupMenu;

const Me = imports.misc.extensionUtils.getCurrentExtension();

const Ec2PopupMenuScrollSection = new Lang.Class({
    Name: 'Ec2PopupMenuScrollSection',
    Extends: PopupMenu.PopupMenuSection,
    _init: function() {
        this.parent();
        this.scrollView = new St.ScrollView({ x_fill: true, y_fill: false, x_align: St.Align.START, y_align: St.Align.START});
        this.scrollView.set_policy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC);
        this.box = new St.BoxLayout({ style_class: 'popup-combobox-item', vertical: true, style:'spacing: 0px' });
        this.scrollView.add_actor(this.box);
        this.actor = this.scrollView;
        this.actor._delegate = this;
    }
});
