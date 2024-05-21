|%
+$  suit  ?(%hearts %spades %clubs %diamonds)
+$  darc  [sut=suit val=@ud]  :: see below about naming
+$  deck  (list darc)
++  make-deck
  ^-  deck
  =/  mydeck  *deck
  =/  i  1
  |-
  ?:  (gth i 4)
    mydeck
  =/  j  2
  |-
  ?.  (lte j 13)
    ^$(i +(i))
  %=  $
    j       +(j)
    mydeck  [[(num-to-suit i) j] mydeck]
  ==
++  num-to-suit
  |=  val=@ud
  ^-  suit
  ?+  val  !!
    %1  %hearts
    %2  %spades
    %3  %clubs
    %4  %diamonds
  ==
++  shuffle-deck
  |=  [unshuffled=deck entropy=@]
  ^-  deck
  =/  shuffled  *deck
  =/  random  ~(. og entropy)
  =/  remaining  (lent unshuffled)
  |-
  ?:  =(remaining 1)
    :_  shuffled
    (snag 0 unshuffled)
  =^  index  random  (rads:random remaining)
  %=  $
    shuffled      [(snag index unshuffled) shuffled]
    remaining     (dec remaining)
    unshuffled    (oust [index 1] unshuffled)
  ==
++  draw
  |=  [n=@ud d=deck]
  ^-  [hand=deck rest=deck]
  :-  (scag n d)
  (slag n d)
::
++  pp-card
  |=  c=darc
  (~(got by card-table) c)
++  card-table
  %-  malt
  ^-  (list [darc @t])
  :~  :-  [sut=%clubs val=1]  '🃑'
      :-  [sut=%clubs val=2]  '🃒'
      :-  [sut=%clubs val=3]  '🃓'
      :-  [sut=%clubs val=4]  '🃔'
      :-  [sut=%clubs val=5]  '🃕'
      :-  [sut=%clubs val=6]  '🃖'
      :-  [sut=%clubs val=7]  '🃗'
      :-  [sut=%clubs val=8]  '🃘'
      :-  [sut=%clubs val=9]  '🃙'
      :-  [sut=%clubs val=10]  '🃚'
      :-  [sut=%clubs val=11]  '🃛'
      :-  [sut=%clubs val=12]  '🃝'
      :-  [sut=%clubs val=13]  '🃞'
      :-  [sut=%diamonds val=1]  '🃁'
      :-  [sut=%diamonds val=2]  '🃂'
      :-  [sut=%diamonds val=3]  '🃃'
      :-  [sut=%diamonds val=4]  '🃄'
      :-  [sut=%diamonds val=5]  '🃅'
      :-  [sut=%diamonds val=6]  '🃆'
      :-  [sut=%diamonds val=7]  '🃇'
      :-  [sut=%diamonds val=8]  '🃈'
      :-  [sut=%diamonds val=9]  '🃉'
      :-  [sut=%diamonds val=10]  '🃊'
      :-  [sut=%diamonds val=11]  '🃋'
      :-  [sut=%diamonds val=12]  '🃍'
      :-  [sut=%diamonds val=13]  '🃎'
      :-  [sut=%hearts val=1]  '🂱'
      :-  [sut=%hearts val=2]  '🂲'
      :-  [sut=%hearts val=3]  '🂳'
      :-  [sut=%hearts val=4]  '🂴'
      :-  [sut=%hearts val=5]  '🂵'
      :-  [sut=%hearts val=6]  '🂶'
      :-  [sut=%hearts val=7]  '🂷'
      :-  [sut=%hearts val=8]  '🂸'
      :-  [sut=%hearts val=9]  '🂹'
      :-  [sut=%hearts val=10]  '🂺'
      :-  [sut=%hearts val=11]  '🂻'
      :-  [sut=%hearts val=12]  '🂽'
      :-  [sut=%hearts val=13]  '🂾'
      :-  [sut=%spades val=1]  '🂡'
      :-  [sut=%spades val=2]  '🂢'
      :-  [sut=%spades val=3]  '🂣'
      :-  [sut=%spades val=4]  '🂤'
      :-  [sut=%spades val=5]  '🂥'
      :-  [sut=%spades val=6]  '🂦'
      :-  [sut=%spades val=7]  '🂧'
      :-  [sut=%spades val=8]  '🂨'
      :-  [sut=%spades val=9]  '🂩'
      :-  [sut=%spades val=10]  '🂪'
      :-  [sut=%spades val=11]  '🂫'
      :-  [sut=%spades val=12]  '🂭'
      :-  [sut=%spades val=13]  '🂮'
  ==
--
