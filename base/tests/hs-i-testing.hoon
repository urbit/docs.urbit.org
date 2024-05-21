/+  *test, *absolute
|%
++  test-absolute
  ;:  weld
    %+  expect-eq
      !>  .1
      !>  (absolute .1)
    %+  expect-eq
      !>  .1
      !>  (absolute .1)
    %+  expect-eq
      !>  (absolute .0)
      !>  .0
  ==
--
