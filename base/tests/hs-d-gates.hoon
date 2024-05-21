/+  *test, fake-dojo
|%
::
++  test-create-your-own-gate
  |^
  ;:  weld
    %+  expect-eq
      !>  (~(fmt fake-dojo [0 100]) in)
      !>  out
  ==
  ::
  ++  in
    '''
    |=  [a=@ud b=@ud]
    ?:  (gth a b)
      a
    b
    '''
  ::
  ++  out
    '''
    < 1.tfm
      [ [a=@ud b=@ud]
        [our=@p now=@da eny=@uvJ]
        <15.eah 40.lcv 14.tdo 54.dnu 77.mau 236.dqo 51.njr 139.hzy 33.uof 1.pnw %138>
      ]
    >
    '''
  --
--
