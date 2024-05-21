/+  *test, fake-dojo
|%
::
++  test-list
  |^
  ;:  weld
    %+  expect-eq
      !>  (list-hoon 5)
      !>  `(list @ud)`~[1 2 3 4]
    %+  expect-eq
      !>  (list-hoon 10)
      !>  `(list @ud)`~[1 2 3 4 5 6 7 8 9]
    %+  expect-eq
      !>  (list-hoon 1)
      !>  `(list @ud)`~
  ==
  ::
  ++  list-hoon
    |=  end=@
    =/  count=@  1
    |-
    ^-  (list @)
    ?:  =(end count)
      ~
    :-  count
    $(count (add 1 count))
  --
++  test-tree-address
  |^
  ;:  weld
    %+  expect-eq
      !>  +1:data
      !>  `(list @ud)`~[1 2 3 4]
    %+  expect-eq
      !>  +2:data
      !>  1
    %+  expect-eq
      !>  +3:data
      !>  `(list @ud)`[2 3 4 ~]
    %-  expect-fail
      |.  +4:data
    %+  expect-eq
      !>  +6:data
      !>  2
    %+  expect-eq
      !>  +7:data
      !>  `(list @ud)`[3 4 ~]
    %+  expect-eq
      !>  +14:data
      !>  3
    %+  expect-eq
      !>  +15:data
      !>  `(list @ud)`[4 ~]
    %+  expect-eq
      !>  +30:data
      !>  4
    %+  expect-eq
      !>  +31:data
      !>  `(list @ud)`~
  ==
  ::
  ++  data  `(list @ud)`~[1 2 3 4]
  --
  ::
++  test-trivial-lists
  ;:  weld
    %+  expect-eq
      !>  `(list @)`['a' %b 100 ~]
      !>  `(list @)`~[97 98 100]
    %+  expect-eq
      !>  `(list (list @ud))`~[~[1 2 3] ~[4 5 6]]
      !>  `(list (list @ud))`~[~[1 2 3] ~[4 5 6]]
    %+  expect-eq
      !>  `(list @ud)`[3 4 5 ~]
      !>  `(list @ud)`~[3 4 5]
    %+  expect-eq
      !>  (~(fmt fake-dojo [0 100]) '-:!>([3 4 5 ~])')
      !>  '#t/[@ud @ud @ud %~]'
    %+  expect-eq
      !>  (~(fmt fake-dojo [0 100]) '-:!>(`(list @ud)`[3 4 5 ~])')
      !>  '#t/it(@ud)'
  ==
++  test-wings
  ;:  weld
    %+  expect-eq
      !>  c.b:[[4 a=5] b=[c=14 15]]
      !>  14
    %+  expect-eq
      !>  b.b:[b=[a=1 b=2 c=3] a=11]
      !>  2
    %+  expect-eq
      !>  a.b:[b=[a=1 b=2 c=3] a=11]
      !>  1
    %+  expect-eq
      !>  c.b:[b=[a=1 b=2 c=3] a=11]
      !>  3
    %+  expect-eq
      !>  a:[b=[a=1 b=2 c=3] a=11]
      !>  11
    %-  expect-fail
      |.  (slap !>(..zuse) (ream 'b.a:[b=[a=1 b=2 c=3] a=11]'))
    %+  expect-eq
      !>  g.s:[s=[c=[d=12 e='hello'] g=[h=0xff i=0b11]] r='howdy']
      !>  [h=0xff i=0b11]
    %+  expect-eq
      !>  c.s:[s=[c=[d=12 e='hello'] g=[h=0xff i=0b11]] r='howdy']
      !>  [d=12 e='hello']
    %+  expect-eq
      !>  e.c.s:[s=[c=[d=12 e='hello'] g=[h=0xff i=0b11]] r='howdy']
      !>  'hello'
    %+  expect-eq
      !>  +3:[s=[c=[d=12 e='hello'] g=[h=0xff i=0b11]] r='howdy']
      !>  r='howdy'
    %+  expect-eq
      !>  r.+3:[s=[c=[d=12 e='hello'] g=[h=0xff i=0b11]] r='howdy']
      !>  'howdy'
    %+  expect-eq
      !>  =/  data  [a=[aa=[aaa=[1 2] bbb=[3 4]] bb=[5 6]] b=[7 8]]
          -:aaa.aa.a.data
      !>  1
  ==
::
++  test-names-and-faces
  ;:  weld
    %+  expect-eq
      !>  b=5
      !>  b=5
    %+  expect-eq
      !>  (~(fmt fake-dojo [0 100]) '[b=5 cat=6]')
      !>  '[b=5 cat=6]'
    %+  expect-eq
      !>  -:[b=5 cat=6]
      !>  b=5
    %+  expect-eq
      !>  b:[b=5 cat=6]
      !>  b=5
    %+  expect-eq
      !>  b2:[[4 b2=5] [cat=6 d=[14 15]]]
      !>  5
    %+  expect-eq
      !>  d:[[4 b2=5] [cat=6 d=[14 15]]]
      !>  [14 15]
    %+  expect-eq
      !>  (add b=5 1)
      !>  6
    %-  expect-fail
      ::  -find.a
      |.  (slap !>(..zuse) (ream 'a:[b=12 c=14]'))
    %+  expect-eq
      !>  b:[b=c=123 d=456]
      !>  c=123
  ==
++  test-duplicate-faces
  ;:  weld
    %+  expect-eq
      !>  [[4 b=5] [b=6 b=[14 15]]]
      !>  [[4 b=5] b=6 b=[14 15]]
    %+  expect-eq
      !>  b:[[4 b=5] [b=6 b=[14 15]]]
      !>  5
    %-  expect-fail
      ::  -find.c
      |.  (slap !>(..zuse) (ream 'c:[[4 b=5] [b=6 b=[c=14 15]]]'))
    %+  expect-eq
      !>  ^b:[[4 b=5] [b=6 b=[14 15]]]
      !>  6
    %+  expect-eq
      !>  a:[[[a=1 a=2] a=3] a=4]
      !>  1
    %+  expect-eq
      !>  ^a:[[[a=1 a=2] a=3] a=4]
      !>  2
    %+  expect-eq
      !>  ^^a:[[[a=1 a=2] a=3] a=4]
      !>  3
    %+  expect-eq
      !>  ^^^a:[[[a=1 a=2] a=3] a=4]
      !>  4
    %+  expect-eq
      !>  b:[b=[a=1 b=2 c=3] a=11]
      !>  [a=1 b=2 c=3]
    %-  expect-fail
      ::  -find.^b
      |.  (slap !>(..zuse) (ream '^b:[b=[a=1 b=2 c=3] a=11]'))
  ==
++  test-num2dig
  |^
  ;:  weld
    %+  expect-eq
      !>  (num2dig 1.000)
      !>  `(list @ud)`~[1 0 0 0]
    %+  expect-eq
      !>  (num2dig 123.456.789)
      !>  `(list @ud)`~[1 2 3 4 5 6 7 8 9]
    %+  expect-eq
      !>  (num2dig-2 1.000)
      !>  `(list @ud)`~[1 0 0 0]
    %+  expect-eq
      !>  (num2dig-2 123.456.789)
      !>  `(list @ud)`~[1 2 3 4 5 6 7 8 9]
    %+  expect-eq
      !>  (num2dig-3 1.000)
      !>  `(list @t)`~['1' '0' '0' '0']
  ==
  ::
  ++  num2dig
    !:
    |=  [n=@ud]
    =/  values  *(list @ud)
    |-  ^-  (list @ud)
    ?:  (lte n 0)  values
    %=  $
      n       (div n 10)
      values  (weld ~[(mod n 10)] values)
    ==
  ::
  ++  num2dig-2
    !:
    |=  [n=@ud]
    =/  values  *(list @ud)
    |-  ^-  (list @ud)
    ?:  (lte n 0)  values
    %=  $
      n       (div n 10)
      values  (mod n 10)^values
    ==
  ::
  ++  num2dig-3
    !:
    |=  [n=@ud]
    =/  values  *(list @t)
    |-  ^-  (list @t)
    ?:  (lte n 0)  values
    %=  $
      n       (div n 10)
      values  (@t (add 48 (mod n 10)))^values
    ==
  --
::
++  test-resolving-wings
  =/  a  [[[b=%bweh a=%.y c=8] b="no" c="false"] 9]
  ;:  weld
    %+  expect-eq
      !>  b:a(a [b=%skrt a="four"])
      !>  %bweh
    %+  expect-eq
      !>  ^b:a(a [b=%skrt a="four"])
      !>  "no"
    %-  expect-fail
      ::  Error: ford: %slim failed:
      |.  (slap !>(..zuse) (ream '=/  a  [[[b=%bweh a=%.y c=8] b="no" c="false"] 9]  ^^b:a(a [b=%skrt a="four"])'))
    %+  expect-eq
      !>  b.a:a(a [b=%skrt a="four"])
      !>  %skrt
    %+  expect-eq
      !>  a.a:a(a [b=%skrt a="four"])
      !>  "four"
    %+  expect-eq
      !>  +.a:a(a [b=%skrt a="four"])
      !>  a="four"
    %+  expect-eq
      !>  a:+.a:a(a [b=%skrt a="four"])
      !>  "four"
    %+  expect-eq
      !>  a(a a)
      !>  [[[b=%bweh a=[[[b=%bweh a=%.y c=8] b="no" c="false"] 9] c=8] b="no" c="false"] 9]
    %+  expect-eq
      !>  b:-<.a(a a)
      !>  %bweh
  ==
::
++  test-list-ops
  ;:  weld
    %+  expect-eq
      !>  (flop ~[1 2 3 4 5])
      !>  `(list @ud)`~[5 4 3 2 1]
    %+  expect-eq
      !>  (sort ~[1 3 5 2 4] lth)
      !>  `(list @ud)`~[1 2 3 4 5]
    %+  expect-eq
      !>  (snag 0 `(list @)`~[11 22 33 44])
      !>  11
    %+  expect-eq
      !>  (snag 1 `(list @)`~[11 22 33 44])
      !>  22
    %+  expect-eq
      !>  (snag 3 `(list @)`~[11 22 33 44])
      !>  44
    %+  expect-eq
      !>  (snag 3 "Hello!")
      !>  'l'
    %+  expect-eq
      !>  (snag 1 "Hello!")
      !>  'e'
    %+  expect-eq
      !>  (snag 5 "Hello!")
      !>  '!'
    %+  expect-eq
      !>  (weld ~[1 2 3] ~[4 5 6])
      !>  `(list @ud)`~[1 2 3 4 5 6]
    %+  expect-eq
      !>  (weld "Happy " "Birthday!")
      !>  "Happy Birthday!"
    %+  expect-eq
      !>  (gulf 5 10)  
      !>  `(list @ud)`~[5 6 7 8 9 10]
    %+  expect-eq
      !>  (reap 5 0x0)
      !>  `(list @ux)`~[0x0 0x0 0x0 0x0 0x0]
    %+  expect-eq
      !>  (reap 8 'a')
      !>  `(list @t)`~['a' 'a' 'a' 'a' 'a' 'a' 'a' 'a']
    %+  expect-eq
      !>  `tape`(reap 8 'a')
      !>  "aaaaaaaa"
    %+  expect-eq
      !>  (reap 5 (gulf 5 10))
      !>  `(list (list @ud))`~[~[5 6 7 8 9 10] ~[5 6 7 8 9 10] ~[5 6 7 8 9 10] ~[5 6 7 8 9 10] ~[5 6 7 8 9 10]]
    %+  expect-eq
      !>  (roll `(list @)`~[11 22 33 44 55] add)
      !>  165
    %+  expect-eq
      !>  (roll `(list @)`~[11 22 33 44 55] mul)
      !>  19.326.120
  ==
++  test-lent
  ;:  weld
    %+  expect-eq
      !>  (lent ~[1 2 3 4 5])
      !>  5
    %+  expect-eq
      !>  (lent ~[~[1 2] ~[1 2 3] ~[2 3 4]])
      !>  3
    %+  expect-eq
      !>  (lent ~[1 2 (weld ~[1 2 3] ~[4 5 6])])
      !>  3
  ==
++  test-weld
  =/  b  ~['moon' 'planet' 'star' 'galaxy']
  =/  c  ~[1 2 3]
  ;:  weld
    %+  expect-eq
      !>  (weld b b)
      !>  `(list @t)`~['moon' 'planet' 'star' 'galaxy' 'moon' 'planet' 'star' 'galaxy']
    %-  expect-fail
      |.  (slap !>(..zuse) (ream '(weld *(list @t) *(list @ud))'))
    %-  expect-fail
      |.  (slap !>(..zuse) (ream '(lent (weld *(list @t) *(list @ud)))'))
    %+  expect-eq
      !>  (add (lent b) (lent c))
      !>  7
  ==
::
++  test-palindrome
  ;:  weld
    %+  expect-eq
    !>  %.  "racecar"
        |=  a=(list)
        =(a (flop a))
    !>  &
  ==
::
--
