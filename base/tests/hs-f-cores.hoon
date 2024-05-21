/+  *test, fake-dojo
|%
::
++  test-factorial
  |^
  ;:  weld
    %+  expect-eq
      !>  (fact-1 5)
      !>  120
    %+  expect-eq
      !>  (fact-2 5)
      !>  120
    %+  expect-eq
      !>  (fact-3 5)
      !>  120
    %+  expect-eq
      !>  (fact-tail 5)
      !>  120
  ==
  ::
  ++  fact-1
    |=  n=@ud
    |-
    ~&  n
    ?:  =(n 1)
      1
    %+  mul
      n
    %=  $
      n  (dec n)
    ==
  ::
  ++  fact-2
    |=  n=@ud
    ?:  =(n 1)
      1
    %+  mul
      n
    %=  $
      n  (dec n)
    ==
  ::
  ++  fact-3
    |=  n=@ud
    ?:  =(n 1)
      1
    (mul n $(n (dec n)))
  ::
  ++  fact-tail
    |=  n=@ud
    =/  t=@ud  1
    |-
    ^-  @ud
    ?:  =(n 1)  t
    $(n (dec n), t (mul t n))
  --
::
++  test-zapcom
  |^
  ;:  weld
    %+  expect-eq
      !>  (~(fmt fake-dojo [0 100]) in)
      !>  out
  ==
  ::
  ++  in
    '''
    !,  *hoon  (add 5 6)
    '''
  ::
  ++  out
    '''
    [%cncl p=[%wing p=~[%add]] q=[i=[%sand p=%ud q=5] t=[i=[%sand p=%ud q=6] t=~]]]
    '''
  --
++  test-zapcom-2
  |^
  ;:  weld
    %+  expect-eq
      !>  (~(fmt fake-dojo [0 120]) in)
      !>  out
  ==
  ::
  ++  in
    '''
    !,  *hoon
    |=  n=@ud
    |-  
    ~&  n  
    ?:  =(n 1)  
      1
    %+  mul  
      n
    %=  $  
      n  (dec n)  
    ==  
    '''
  ::
  ++  out
    '''
    [ %brts
      p=[%bcts p=term=%n q=[%base p=[%atom p=~.ud]]]
        q
      [ %brhp
          p
        [ %sgpm
          p=0
          q=[%wing p=~[%n]]
            r
          [ %wtcl
            p=[%dtts p=[%wing p=~[%n]] q=[%sand p=%ud q=1]]
            q=[%sand p=%ud q=1]
              r
            [ %cnls
              p=[%wing p=~[%mul]]
              q=[%wing p=~[%n]]
              r=[%cnts p=~[%$] q=[i=[p=~[%n] q=[%cncl p=[%wing p=~[%dec]] q=[i=[%wing p=~[%n]] t=~]]] t=~]]
            ]
          ]
        ]
      ]
    ]
    '''
  --
::
++  test-adder
  |^
  ;:  weld
    %+  expect-eq
      !>  (add-one:adder 5)
      !>  6
    %+  expect-eq
      !>  (sub-one:adder 5)
      !>  4
  ==
  ::
  ++  adder
    |%
    ++  add-one
      |=  a=@ud
      ^-  @ud
      (add a 1)
    ++  sub-one
      |=  a=@ud
      ^-  @ud
      (sub a 1)
    --
  --
::  TODO +7
::
++  test-inc
  |^
  ;:  weld
    %+  expect-eq
      !>  (inc 5)
      !>  6
    %+  expect-eq
      !>  (~(fmt fake-dojo [0 100]) inc-two)
      !>  out-two
    %+  expect-eq
      !>  $:inc
      !>  1
    %+  expect-eq
      !>  (~(fmt fake-dojo [0 100]) inc-txt)
      !>  inc-core-txt
    %+  expect-eq
      !>  (~(fmt fake-dojo [0 100]) inc-six)
      !>  'a=0'
    %+  expect-eq
      !>  (inc 234)
      !>  235
  ==
  ::
  ++  inc          |=(a=@ (add 1 a))
  ++  inc-txt     '|=(a=@ (add 1 a))'
  ++  inc-two  '+2:|=(a=@ (add 1 a))'
  ++  inc-six  '+6:|=(a=@ (add 1 a))'
  ++  inc-sev  '+7:|=(a=@ (add 1 a))'
  ++  out-two  '[8 [9 36 0 4.095] 9 2 10 [6 [7 [0 3] 1 1] 0 14] 0 2]'
  ++  inc-core-txt
    '''
    < 1.mgz
      [ a=@
        [our=@p now=@da eny=@uvJ]
        <15.eah 40.lcv 14.tdo 54.dnu 77.mau 236.dqo 51.njr 139.hzy 33.uof 1.pnw %138>
      ]
    >
    '''
  --
::
++  test-modify-gate
  =+  b=10
  |^
  ;:  weld
    %+  expect-eq
      !>  (ten 10)
      !>  20
    %+  expect-eq
      !>  (ten 20)
      !>  30
    %+  expect-eq
      !>  (ten 25)
      !>  35
    %+  expect-eq
      !>  (ten 15)
      !>  25
    %+  expect-eq
      !>  (ten 35)
      !>  45
    %+  expect-eq
      !>  (ten(b 25) 10)
      !>  35
    %+  expect-eq
      !>  (ten(b 1) 25)
      !>  26
    %+  expect-eq
      !>  (ten(b 75) 25)
      !>  100
  ==
  ::
  ++  ten
    |=(a=@ (add a b))
  --
::
++  test-fibonacci
  |^
  ;:  weld
    %+  expect-eq
      !>  (fibonacci 5)
      !>  5
    %+  expect-eq
      !>  (fibonacci 6)
      !>  8
    %+  expect-eq
      !>  (fib-v2 5)
      !>  `(list @ud)`~[1 1 2 3 5]
    %+  expect-eq
      !>  (fib-v3 5)
      !>  `(list @ud)`~[1 1 2 3 5]
    %+  expect-eq
      !>  (fib-v4 5)
      !>  `(list @ud)`~[0 1 1 2 3 5]
  ==
  ::
  ++  fibonacci
    |=  n=@ud
    ^-  @ud
    ?:  =(n 1)  1
    ?:  =(n 2)  1
    (add $(n (dec n)) $(n (dec (dec n))))
  ::
  ++  fib-v2
    |=  n=@ud
    =/  index  0
    =/  p  0
    =/  q  1
    =/  r  *(list @ud)
    |-  ^-  (list @ud)
    ?:  =(index n)  r
    ~&  >  [index p q r]
    %=  $
      index  +(index)
      p      q
      q      (add p q)
      r      (snoc r q)
    ==
  ::
  ++  fib-v3
    |=  n=@ud
    %-  flop
    =/  index  0
    =/  p  0
    =/  q  1
    =/  r  *(list @ud)
    |-  ^-  (list @ud)
    ?:  =(index n)  r
    %=  $
      index  +(index)
      p      q
      q      (add p q)
      r      [q r]
    ==
  ::
  ++  fib-v4
    |=  n=@ud
    ^-  (list @ud)
    =/  f0  *@ud
    =/  f1=@ud  1
    :-  0
    |-  ^-  (list @ud)
    ?:  =(n 0)
      ~
    [f1 $(f0 f1, f1 (add f0 f1), n (dec n))]
  --
++  test-ackermann
  |^
  ;:  weld
    %+  expect-eq
      !>  (ackermann 1 2)
      !>  4
  ==
  ::
  ++  ackermann
    |=  [m=@ n=@]
    ^-  @
    ?:  =(m 0)  +(n)
    ?:  =(n 0)  $(m (dec m), n 1)
    $(m (dec m), n $(n (dec n)))
  --
--
