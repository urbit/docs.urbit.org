/+  *test
::
|%
++  test-sein-title
  ;:  weld
    %+  expect-eq
      :: !>  (sein:title our.bowl now.bowl ~marzod)
      :: !>  ~zod
      !>  +<:sein:title
      !>  [our=~zod now=~2000.1.1 who=~zod]
  ==
--
