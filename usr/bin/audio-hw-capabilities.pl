#!/usr/bin/perl
use strict;
use warnings;
use feature qw(say);
 
# put the following in ~/.asoundrc
# defaults.namehint.extended on
# without the comment line of course
 
foreach my $direction ("Capture:", "Playback:") {
    my $cmd = 'arecord';
    my $cmd_mid = ' --device=';
    my $cmd_end = ' --duration=1 --dump-hw-params /dev/null 2>&1';
    if ($direction eq "Playback:") {
        $cmd = 'aplay';
        $cmd_mid = ' /dev/zero --device=';
        $cmd_end = ' --duration=1 --dump-hw-params 2>&1';
    }
    say $direction;
    chomp(my @devices = grep(/^hw:/, `$cmd -L`));
    foreach my $device (@devices) {
        chomp(my @data = `${cmd}${cmd_mid}${device}${cmd_end}`);
        if($data[0] =~ 'audio open error') {
            say("\tHW Params of device \"$device\":");
            say("\t\t$data[0]");
            next;
        }
        say("\t$data[1]");
        say("\t\t$data[4]");
        say("\t\t$data[9]");
    }

    }
