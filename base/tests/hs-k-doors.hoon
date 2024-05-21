/+  *test, fake-dojo
|%
::
++  test-gate-building-cates
  ;:  weld
    %+  expect-eq
      !>  =/  inc  |=(a=@ (add 1 a))
          (inc 10)
      !>  11
    %+  expect-eq
      !>  (|=(a=@ (add 1 a)) 123)
      !>  124
    %+  expect-eq
      !>  (|=(a=@ (mul 2 a)) 123)
      !>  246
    %+  expect-eq
      !>  (add 12 23)
      !>  35
    %+  expect-eq
      !>  (mul 12 23)
      !>  276
  ==
--
