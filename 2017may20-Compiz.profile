[wall]
as_miniscreen = true
as_preview_timeout = 0.129900
as_preview_scale = 400
as_edge_radius = 0
as_border_width = 23
as_outline_color = #d081ffd9
as_background_gradient_base_color = #e5cce6d9
as_background_gradient_highlight_color = #dcbcf7d9
as_background_gradient_shadow_color = #e5cce6d9
as_thumb_gradient_base_color = #ff0000ff
as_thumb_gradient_highlight_color = #ff0000ff
as_thumb_highlight_gradient_base_color = #ff0000f3
as_thumb_highlight_gradient_shadow_color = #ff0000a6
as_arrow_base_color = #b556ffd9
as_arrow_shadow_color = #530072d9
as_slide_duration = 1.027200
s0_edgeflip_move = false

[resizeinfo]
as_text_family = WreatheSystem
as_title_size = 36

[core]
as_active_plugins = core;ccp;move;resize;place;decoration;commands;text;workarounds;winrules;annotate;mousepoll;dbus;mag;wizard;extrawm;dialog;blur;crashhandler;colorfilter;notification;svg;titleinfo;regex;neg;animation;png;grid;shift;toggledeco;snow;wall;resizeinfo;obs;animationsim;fade;scale;animationaddon;expo;ezoom;staticswitcher;scalefilter;scaleaddon;opacify;group;kdecompat;
as_cursor_theme = Wreathe-hiDPI
as_texture_filter = 0
as_close_window_key = F17
as_minimize_window_key = F15
as_toggle_window_maximized_key = F16
s0_hsize = 2
s0_vsize = 2
s0_detect_refresh_rate = false
s0_refresh_rate = 60
s0_outputs = 3840x2160+0+0;
s0_focus_prevention_level = 1
s0_focus_prevention_match = !(class=dolphin)
s0_force_independent_output_painting = true

[commands]
as_command0 = kioclient5 exec /usr/share/applications/org.kde.dolphin.desktop
as_command1 = kioclient5 exec /usr/share/applications/org.kde.spectacle.desktop
as_command2 = dbus-send --dest=org.kde.Spectacle --type=method_call / org.kde.Spectacle.FullScreen boolean:true
as_command3 = dbus-send --dest=org.kde.Spectacle --type=method_call / org.kde.Spectacle.ActiveWindow boolean:true boolean:false
as_command4 = wmctrl -r :ACTIVE: -b toggle,maximized_vert
as_command5 = wmctrl -c :ACTIVE:
as_command6 = wmctrl -c :ACTIVE:
as_command7 = wmctrl -c :ACTIVE:
as_command8 = xte "mouseclick 3"
as_command9 = krunner
as_command10 = sleep 0.5; xset dpms force off
as_command11 = wmctrl -c :ACTIVE:
as_command12 = systemctl suspend
as_command13 = gmusicbrowser
as_command14 = libreoffice --writer
as_command15 = firefox
as_command16 = kontact
as_command20 = gnome-do
as_command21 = compiz-cmd-21
as_command22 = compiz-cmd-22
as_command23 = compiz-cmd-23
as_command24 = compiz-cmd-24
as_run_command0_key = F14
as_run_command1_key = <Shift>Print
as_run_command2_key = Print
as_run_command3_key = <Control><Primary>Print
as_run_command4_key = <Control><Primary>2
as_run_command5_key = <Shift><Control><Primary>q
as_run_command6_key = <Control><Primary>F17
as_run_command7_key = <Shift><Control><Primary>F17
as_run_command8_key = F26
as_run_command9_key = <Shift><Control><Primary>space
as_run_command10_key = <Shift>F1
as_run_command11_key = <Control><Primary>q
as_run_command12_key = <Shift><Control><Primary>F14
as_run_command13_key = F18
as_run_command14_key = <Shift><Control><Primary>F18
as_run_command15_key = <Shift><Control><Primary>XF86AudioPrev
as_run_command16_key = <Shift><Control><Primary>XF86AudioPause

[fakeargb]
as_window_toggle_key = <Shift><Control><Primary>F19

[bench]
as_initiate_key = <Super>0

[static]
s0_window_match = plasmashell

[scaleaddon]
s0_title_font = WreatheSystem
s0_title_size = 48
s0_border_size = 15
s0_font_color = #d3b5eaff
s0_back_color = #04005be1
s0_window_highlight = true
s0_highlight_color = #ffffff25

[workarounds]
as_legacy_fullscreen = true
as_firefox_menu_fix = true
as_notification_daemon_fix = true
as_java_taskbar_fix = true
as_qt_fix = true
as_convert_urgency = true
as_aiglx_fragment_fix = false
as_force_glx_sync = false

[winrules]
s0_skiptaskbar_match = class=Onboard
s0_skippager_match = class=Onboard
s0_above_match = class=Onboard
s0_sticky_match = class=Onboard
s0_maximize_match = class=Xarchiver
s0_no_move_match = class=Onboard
s0_no_resize_match = class=Onboard
s0_no_minimize_match = class=Onboard
s0_no_maximize_match = class=Onboard
s0_no_focus_match = class=Onboard

[opacify]
as_timeout = 150
s0_only_if_block = true
s0_window_match = (Normal | Dialog | ModalDialog | Utility | Toolbar | Fullscreen) & !(class=Onboard)
s0_passive_opacity = 50

[shelf]
as_trigger_key = <Shift><Control><Primary><Alt>greater
as_reset_key = <Shift><Control><Primary><Alt>p
as_interval = 0.950000

[group]
as_select_button = <Shift><Control><Primary><Alt>Button1
as_select_single_key = <Shift><Control><Primary><Alt>s
as_group_key = <Shift><Control><Primary><Alt>g
as_ungroup_key = <Shift><Control><Primary><Alt>u
as_tabmode_key = <Shift><Control><Primary><Alt>t
as_change_tab_left_key = <Shift><Control><Primary><Alt>Left
as_change_tab_right_key = <Shift><Control><Primary><Alt>Right
s0_fill_color = #d9489c55
s0_thumb_size = 256
s0_tabbar_font_family = Linux Biolinum O
s0_tabbar_font_size = 24

[stackswitch]
as_next_key = <Alt>Tab
s0_tilt = 5

[annotate]
as_initiate_free_draw_button = <Shift><Control><Primary>Button2
as_erase_button = <Shift><Control><Primary>Button2
as_clear_key = <Shift><Control><Primary>colon
as_stroke_color = #ff0000ff
as_stroke_width = 9.000000

[addhelper]
as_ononinit = true

[cube]
s0_images = 
s0_active_opacity = 0.000000

[obs]
as_opacity_increase_button = <Control><Primary><Alt>Button3
as_opacity_decrease_button = <Control><Primary><Alt>Button1
as_brightness_increase_key = <Shift><Control><Primary><Alt>r
as_brightness_decrease_key = <Shift><Control><Primary><Alt>b
s0_opacity_matches = name=xvisbell;
s0_opacity_values = 75;

[animationsim]
s0_flyin_direction_y = 10.000000
s0_flyin_distance = 30.000000

[mblur]
as_initiate_key = <Shift><Control><Primary>numbersign

[ring]
as_next_key = <Alt>Tab
as_prev_key = <Shift><Alt>Tab

[widget]
as_toggle_edge = Top
s0_match = type=Dock
s0_fade_time = 0.000000
s0_bg_brightness = 100

[fade]
s0_fullscreen_visual_bell = true
s0_minimize_open_close = false

[kdecompat]
s0_sliding_popups = false

[mag]
as_initiate = <Shift><Control><Primary>equal
s0_box_width = 800
s0_box_height = 600
s0_border = 6

[wizard]
as_initiate = <Alt>XF86AudioLowerVolume
s0_gy = 0.000100
s0_g_strength = 
s0_g_posx = 
s0_g_posy = 
s0_g_speed = 
s0_g_angle = 
s0_g_movement = 
s0_e_active = false;false;true;false;false;false;false;false;false;false;
s0_e_count = 50;20;20;20;20;200;200;200;200;200;
s0_e_h = 67;100;700;0;0;0;167;333;667;833;
s0_e_dh = 100;150;50;500;500;133;133;133;133;133;
s0_e_l = 450;600;700;650;650;650;650;650;650;650;
s0_e_dl = 250;100;0;150;150;150;150;150;150;150;
s0_e_da = 200;200;100;200;200;200;200;200;200;200;
s0_e_dcirc = 30;5;0;0;0;5;5;5;5;5;
s0_e_vx = 0;0;10;0;0;0;0;0;0;0;
s0_e_vy = 0;-200;10;0;0;0;0;0;0;0;
s0_e_dvcirc = 50;0;50;50;50;500;500;500;500;500;
s0_e_dvt = 30;10;50;3;3;5;5;5;5;5;
s0_e_dvphi = 50;50;10;50;50;50;50;50;50;50;
s0_e_s = 50;20;10;50;50;50;50;50;50;50;
s0_e_ds = 25;10;5;25;25;25;25;25;25;25;
s0_e_snew = 300;50;10;125;125;50;50;50;50;50;
s0_e_dsnew = 150;30;5;50;50;25;25;25;25;25;
s0_e_g = 0;0;1;0;0;0;0;0;0;0;
s0_e_dg = 0;0;3;0;200;0;0;0;0;0;
s0_e_gp = 0;0;5;0;10;0;0;0;0;0;

[scale]
as_initiate_edge = 
as_initiate_all_edge = Bottom
as_initiate_all_button = <LeftEdge><BottomEdge><BottomLeftEdge>Button1
as_initiate_all_key = F13
as_show_desktop = false
s0_timestep = 0.100000
s0_darken_back = false
s0_opacity = 90

[extrawm]
as_toggle_fullscreen_key = <Shift>F11

[move]
as_opacity = 75

[dialog]
as_dialogtypes = (override_redirect=0) & !( class=Firefox & type=Utility ) & !(class=plasmashell) & !(type=Menu | class=Gimp | class=Inkscape | (class=Firefox & type=Tooltip)) & !type=Utility & !type=Tooltip
as_opacity = 95.000000
as_saturation = 100.000000
as_brightness = 85.000000

[decoration]
as_shadow_radius = 0.100000
as_shadow_opacity = 0.010000
as_shadow_color = #ffffffff
as_shadow_x_offset = 0
as_shadow_y_offset = 0
as_command = emerald --replace
as_decoration_match = !(state=maxhorz and state=maxvert)
as_shadow_match = none

[freewins]
as_rotate_right_key = <Shift><Control><Primary>colon

[resize]
as_initiate_button = <Shift><Alt>Button1
as_mode = 2

[blur]
s0_focus_blur_match = none
s0_gaussian_radius = 15
s0_mipmap_lod = 4.000000
s0_independent_tex = true

[expo]
as_expo_key = <Control><Primary>F13
as_expo_edge = BottomLeft
as_dnd_button = Button3
as_exit_button = Button1
as_vp_distance = 1.000000
as_curve = 0.090000
as_hide_docks = true
as_vp_brightness = 95.000000
as_vp_saturation = 85.000000
as_ground_color1 = #a616e0ff
as_ground_color2 = #fbe5ff00
as_ground_size = 0.700000

[elements]
as_over_windows = true
as_toggle = false
as_num_snowflakes = 1500
as_snow_size = 16.000000
as_snow_speed = 5
as_snow_sway = 0
as_snow_rotate = false
as_toggle_snow_check = true
as_wind_direction = 3
as_snow_textures = /home/kyan/2016sept04n12-snowflakes/n2/compiz-plugins-experimental/images/snow/snowflake-blurry.png;
as_autumn_rotate = false

[3d]
s0_width = 0.100000

[crashhandler]
as_start_wm = true
as_wm_cmd = openbox --replace

[colorfilter]
as_toggle_screen_key = <Shift><Alt>f
as_switch_filter_key = Disabled
s0_filter_decorations = true
s0_exclude_match = 
s0_filters = /usr/share/compiz/filters/nightmode;

[snap]
s0_snap_type = 0;1;

[anaglyph]
as_screen_toggle_key = <Shift><Control><Primary><Alt>numbersign

[notification]
as_max_log_level = 2

[place]
s0_mode = 2

[neg]
as_window_toggle_key = <Shift><Control><Primary><Alt>f
as_screen_toggle_key = <Shift><Control><Primary><Alt>o

[wallpaper]
s0_bg_image = /home/kyan/ytdled-2017may11;
s0_bg_image_pos = 0;
s0_bg_fill_type = 1;
s0_bg_color1 = #eb5f5fff;
s0_bg_color2 = #d300ffa4;

[thumbnail]
s0_thumb_size = 368
s0_show_delay = 435
s0_border = 32
s0_thumb_color = #00000000
s0_fade_speed = 0.198000
s0_current_viewport = false
s0_always_on_top = false
s0_window_like = false
s0_title_enabled = false
s0_font_bold = false
s0_font_size = 20

[animation]
s0_open_effects = animation:None;animation:Fade;animation:Glide 1;animation:Glide 2;animation:Glide 2;animationaddon:Beam Up;animationsim:Fly In;
s0_open_durations = 50;150;400;307;307;150;350;
s0_open_matches = class=sddm;name=xvisbell;(class=plasmashell) & (state=fullscreen);(type=Normal | Dialog | ModalDialog | Unknown) & !(name=gnome-screensaver) & !(class=plasmashell);(type=Menu | PopupMenu | DropdownMenu) & !(class=plasmashell);(type=Tooltip | Notification | Utility) & !(name=compiz) & !(title=notify-osd) & !(class=plasmashell);class=plasmashell;
s0_open_options = ;;;;;;;
s0_close_effects = animation:Fade;animation:Glide 1;animation:Glide 2;animationaddon:Beam Up;animation:Glide 2;animationsim:Fly In;
s0_close_durations = 50;400;150;150;200;250;
s0_close_matches = name=xvisbell;(class=plasmashell) & (state=fullscreen);(type=Menu | PopupMenu | DropdownMenu) & !(class=plasmashell);(type=Tooltip | Notification | Utility) & !(name=compiz) & !(title=notify-osd) & !(class=plasmashell);(type=Normal | Dialog | ModalDialog | Unknown) & !(name=gnome-screensaver) & !(class=plasmashell);class=plasmashell;
s0_close_options = ;;;;;flyin_direction=2;
s0_minimize_effects = animation:Zoom;
s0_minimize_durations = 500;

[ezoom]
as_zoom_in_button = Disabled
as_zoom_out_button = Disabled
as_zoom_out_key = <Control><Primary><Alt>u
as_zoom_box_button = Disabled
as_fit_to_window_key = <Shift><Control><Primary><Alt>z

[reflex]
s0_match = dock
s0_window = true
s0_decoration = false

[grid]
as_put_left_key = <Control><Primary>1
as_put_right_key = <Control><Primary>3
as_put_top_key = <Control><Primary>F2
as_put_bottom_key = <Control><Primary>comma
as_put_topleft_key = <Control><Primary>F1
as_put_topright_key = <Control><Primary>F3
as_put_bottomleft_key = <Control><Primary>apostrophe
as_put_bottomright_key = <Control><Primary>period
as_outline_thickness = 6.000000
as_outline_color = #6464979f
as_fill_color = #e1cdffa9

[switcher]
as_next_key = <Control><Primary>Tab
as_prev_key = <Shift><Control><Primary>Tab
as_next_all_key = <Alt>Tab
as_prev_all_key = <Shift><Alt>Tab
s0_speed = 0.100000
s0_timestep = 0.100000

[staticswitcher]
as_next_key = Disabled
as_prev_key = Disabled
as_next_all_key = <Control><Primary>Tab
as_prev_all_key = <Shift><Control><Primary>Tab
as_close_highlighted_key = <Control><Primary>q
s0_window_match = Normal | Toolbar | Utility | Unknown | class=Kfind
s0_popup_delay = 0.105000
s0_highlight_delay_inherit = false
s0_mouse_select = true
s0_mouse_close = true
s0_saturation = 100
s0_brightness = 100
s0_popup_preview_size = 600
s0_popup_border_size = 64
s0_popup_icon_size = 128
s0_highlight_rect_hidden = 2
s0_highlight_border_inlay_color = #ff0000be

[shift]
as_initiate_key = Disabled
as_initiate_button = <TopEdge>Button1
as_terminate_button = Disabled
s0_background_intensity = 1.000000
s0_ground_color1 = #b98bffcc
s0_ground_color2 = #ffffff00
s0_title_font_family = WreatheSystem
s0_title_font_size = 50
s0_title_back_color = #03005b99
s0_title_font_color = #d3b5eaff

[toggledeco]
as_trigger_key = <Shift><Alt>d
as_trigger_all_key = Disabled

[snow]
as_num_snowflakes = 1200
as_snow_size = 16.000000
as_snow_speed = 10
as_screen_depth = 2000
as_snow_over_windows = true
as_snow_rotation = false
as_toggle_key = <Alt>XF86AudioRaiseVolume

[scalefilter]
s0_font_family = Wreathe System
s0_font_bold = false
s0_font_size = 144
s0_border_size = 24
s0_font_color = #f0b0ffff
s0_back_color = #14003799

[zoom]
as_initiate_button = <Shift><Control><Primary><Alt>Button2
as_zoom_in_button = <Shift><Control><Primary><Alt>Button1
as_zoom_out_button = <Shift><Control><Primary><Alt>Button3

[smartput]
as_trigger_key = <Shift><Alt>a
as_trigger_button = <Control><Primary>Button2

[star]
as_num_snowflakes = 1000
as_snow_size = 3.000000
as_snow_speed = 0
as_snow_update_delay = 50
as_snow_rotation = false
as_default_enabled = true

