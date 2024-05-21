|_  [indent=_0 width=_100]
::  this will need updating if the dojo subject changes (ticks)
::
++  dojo-sut  (slop !>([our=*@p now=*@da eny=*@uvJ]) !>(..zuse))
++  run-it
  |=  txt=@t
  =/  res  (eval-cord txt)
  ?:  ?=(%& -.res)
    p.res                   ::  ok   ->  result
  ~&  (flog-tang p.res)
  (flog-tang p.res)         ::  fail ->  wall
::  $-(tang wall)
::
++  flog-tang
  |=  =tang
  ^-  wall
  (zing (turn (flop tang) (cury wash [0 80])))
::  +sell $-(vase tank)
::
++  pcore
  |=  =vase
  ^-  tank
  (sell vase)
::
++  eval-cord
  |=  txt=@t
  ^-  (each * tang)
  !.
  %-  mule  |.
  :-  %noun
  (slap !>(..zuse) (ream txt))
::
++  print-tang
  |=  =tang
  ^-  @t
  %+  rap  3
  (turn tang print-tank)
::
++  print-tank
  |=  =tank
  ^-  @t
  (crip (of-wall:format (wash [0 55] tank)))
::
++  fmt
  |=  in=@t
  ^-  @t
  %-  of-wain:format
  %-  turn  :_  crip
  (wash [indent width] (sell (slap dojo-sut (ream in))))
--
