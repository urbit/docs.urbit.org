/+  default-agent, dbug
|%
+$  versioned-state
  $%  state-0
  ==
+$  state-0  [%0 ~]
+$  card  card:agent:gall
--
%-  agent:dbug
=|  state-0
=*  state  -
^-  agent:gall
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %.n) bowl)
::
++  on-init
  ^-  (quip card _this)
  `this
::
++  on-save
  ^-  vase
  !>(state)
::
++  on-load
  |=  old-state=vase
  ^-  (quip card _this)
  =/  old  !<(versioned-state old-state)
  ?-  -.old
    %0  `this(state old)
  ==
::
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
  ?+    mark  (on-poke:def mark vase)
      %noun
    =/  action  !<(?(%inc %dec) vase)
    ?-    action
        %inc
      :_  this
      :~  [%pass /inc %agent [our.bowl %pokeme] %poke %noun !>(%inc)]
          [%pass /inc %agent [our.bowl %pokeme] %poke %noun !>(%inc)]
      ==
    ::
        %dec
      :_  this
      :~  [%pass /dec %agent [our.bowl %pokeme] %poke %noun !>(%dec)]
          [%pass /dec %agent [our.bowl %pokeme] %poke %noun !>(%dec)]
      ==
    ==
  ==
::
++  on-watch  on-watch:def
++  on-leave  on-leave:def
++  on-peek   on-peek:def
::
++  on-agent
  |=  [=wire =sign:agent:gall]
  ^-  (quip card _this)
  ?+    wire  (on-agent:def wire sign)
      [%inc ~]
    ?.  ?=(%poke-ack -.sign)
      (on-agent:def wire sign)
    ?~  p.sign
      %-  (slog '%pokeit: Increment poke succeeded!' ~)
      `this
    %-  (slog '%pokeit: Increment poke failed!' ~)
    `this
  ::
      [%dec ~]
    ?.  ?=(%poke-ack -.sign)
      (on-agent:def wire sign)
    ?~  p.sign
      %-  (slog '%pokeit: Decrement poke succeeded!' ~)
      `this
    %-  (slog '%pokeit: Decrement poke failed!' ~)
    `this
  ==
::
++  on-arvo   on-arvo:def
++  on-fail   on-fail:def
--
