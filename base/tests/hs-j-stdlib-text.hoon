/+  *test, fake-dojo
|%
::
++  test-text-in-hoon
  ;:  weld
    %+  expect-eq
      !>  `(list @)`[65 83 67 73 73 ~]
      !>  `(list @)`['A' 'S' 'C' 'I' 'I' ~]
    %+  expect-eq
      !>  `@`'this is a cord'
      !>  2.037.307.443.564.446.887.986.503.990.470.772
    %+  expect-eq
      !>  `@ux`'HELLO'
      !>  0x4f.4c4c.4548
    %+  expect-eq
      !>  `@ub`'HELLO'
      !>  0b100.1111.0100.1100.0100.1100.0100.0101.0100.1000
    %+  expect-eq
      !>  `(list @)`"this is a tape"
      !>  `(list @)`~[116 104 105 115 32 105 115 32 97 32 116 97 112 101]
    %+  expect-eq
      !>  `@ta`'hello'
      !>  ~.hello
    %-  expect-fail
      |.  (slap !>(..zuse) (ream '^-  @tas  %5'))
    %+  expect-eq
      !>  ^-  ?(%5)  %5
      !>  %5
    %+  expect-eq
      !>  (?(%5) %5)
      !>  %5
    %+  expect-eq
      !>  "{<(add 5 6)>} is the answer."
      !>  "11 is the answer."
    %+  expect-eq
      !>  (weld "Hello" "Mars!")
      !>  "HelloMars!"
    %+  expect-eq
      !>  %.  ["Hello" "Mars!"]
          |=  [t1=tape t2=tape]
          ^-  tape
          (weld t1 t2)
      !>  "HelloMars!"
  ==
++  test-manipulating-text
  ;:  weld
    %+  expect-eq
      !>  (flop "Hello!")
      !>  "!olleH"
    %+  expect-eq
      !>  (flop (flop "Hello!"))
      !>  "Hello!"
    %+  expect-eq
      !>  (sort ~[37 62 49 921 123] lth)
      !>  `(list @ud)`~[37 49 62 123 921]
    %+  expect-eq
      !>  (sort ~[37 62 49 921 123] gth)
      !>  `(list @ud)`~[921 123 62 49 37]
    %+  expect-eq
      !>  (sort ~['a' 'f' 'e' 'k' 'j'] lth)
      !>  `(list @t)`['a' 'e' 'f' 'j' 'k' ~]
    %+  expect-eq
      !>  (weld "Happy " "Birthday!")
      !>  "Happy Birthday!"
    %+  expect-eq
      !>  (snag 3 "Hello!")
      !>  'l'
    %+  expect-eq
      !>  (snag 1 "Hello!")
      !>  'e'
    %+  expect-eq
      !>  (snag 5 "Hello!")
      !>  '!'
  ==
++  test-snag
  ;:  weld
    %+  expect-eq
      !>  (oust [0 1] `(list @)`~[11 22 33 44])
      !>  `(list @)`~[22 33 44]
    %+  expect-eq
      !>  (oust [0 2] `(list @)`~[11 22 33 44])
      !>  `(list @)`~[33 44]
    %+  expect-eq
      !>  (oust [1 2] `(list @)`~[11 22 33 44])
      !>  `(list @)`~[11 44]
    %+  expect-eq
      !>  (oust [2 2] "Hello!")
      !>  "Heo!"
    %+  expect-eq
      !>  (lent ~[11 22 33 44])
      !>  4
    %+  expect-eq
      !>  (lent "Hello!")
      !>  6
    %+  expect-eq
      !>  (crip "Mars")
      !>  'Mars'
    %+  expect-eq
      !>  (trip 'Earth')
      !>  "Earth"
    %+  expect-eq
      !>  (cass "Hello Mars")
      !>  "hello mars"
    %+  expect-eq
      !>  (cuss "Hello Mars")
      !>  "HELLO MARS"
  ==
::
++  test-analyzing-text
  ;:  weld
    %+  expect-eq
      !>  (find "brillig" "'Twas brillig and the slithy toves")
      !>  `(unit @ud)`[~ 6]
  ==
::
++  test-break-text-at-space
  |^
  ;:  weld
    %+  expect-eq
      !>  %-  my-gate
          "the sky above the port was the color of television tuned to a dead channel"
      !>  `(list tape)`["the" "sky" "above" "the" "port" "was" "the" "color" "of" "television" "tuned" "to" "a" "dead" "channel" ~]
    %+  expect-eq
      !>  `@t`(scot %ud 54.321)
      !>  '54.321'
    %+  expect-eq
      !>  `@t`(scot %ux 54.000)  
      !>  '0xd2f0'
    %+  expect-eq
      !>  (scot %p ~sampel-palnet)
      !>  ~.~sampel-palnet
    %+  expect-eq
      !>  `@t`(scot %p ~sampel-palnet)
      !>  '~sampel-palnet'
    %+  expect-eq
      !>  ((sane %ta) 'ångstrom')
      !>  `?`%.n
    %+  expect-eq
      !>  ((sane %ta) 'angstrom')
      !>  `?`%.y
    %+  expect-eq
      !>  ((sane %tas) 'ångstrom')
      !>  `?`%.n
    %+  expect-eq
      !>  ((sane %tas) 'angstrom')
      !>  `?`%.y
    %+  expect-eq
      !>  0x1234.5678.90ab.cdef
      !>  0x1234.5678.90ab.cdef
    ::  XX
    :: %+  expect-eq
    ::   !>  `@t`0x1234.5678.90ab.cdef
    ::   !>  [%bad-text "[39 239 205 171 144 120 86 52 92 49 50 39 0]"]
    %+  expect-eq
      !>  `@tas`'hello mars'
      !>  `@tas`'hello mars'
    ==
  ::
  ++  my-gate
    |=  ex=tape
    =/  index  0  
    =/  result  *(list tape)  
    |-  ^-  (list tape)  
    ?:  =(index (lent ex))  
      (weld result ~[`tape`(scag index ex)])
    ?:  =((snag index ex) ' ')  
      $(index 0, ex `tape`(slag +(index) ex), result (weld result ~[`tape`(scag index ex)]))    
    $(index +(index))
  --
::  TODO
::    %say generators
::
::  %/gen/add/hoon
::  %/gen/magic-8/hoon
::  %/lib/playing-cards/hoon
::  %/gen/cards/hoon
--
