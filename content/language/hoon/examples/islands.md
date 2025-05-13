# Islands

## Challenge: Largest Island

We are given a map of an island archipelago and want to determine the size of the largest island. We begin with a 2-dimensional grid which is represented as a `(list (list @ud))`. Each `@ud` entry is either a `0`, which represents water, or a `1`, which represents land. We consider two land squares to be part of the same island if they are connected horizontally or vertically, **not diagonally**. We assume that the area outside of the map is entirely water.


You will write a generator `islands` that accepts a `(list (list @ud))` and returns a `@ud` representing the size of the largest island. It should also crash if given an invalid input, for example, if every grid row (the inner `(list @ud)`) is not the same length, or if any `@ud` is greater than `1`.

Example usage:

```
> +islands ~[~[0 0 1 0 0 0 0 1 0 0 0 0 0] ~[0 0 0 0 0 0 0 1 1 1 0 0 0] ~[0 1 1 0 1 0 0 0 0 0 0 0 0] ~[0 1 0 0 1 1 0 0 1 0 1 0 0] ~[0 1 0 0 1 1 0 0 1 1 1 0 0] ~[0 0 0 0 0 0 0 0 0 0 1 0 0] ~[0 0 0 0 0 0 0 1 1 1 0 0 0] ~[0 0 0 0 0 0 0 1 1 0 0 0 0]]
6
```
This input returns 6 this map has a largest island of size 6.

```
> islands ~[~[0 1] ~[0 1 0]]
dojo: naked generator failure
```

```
> islands ~[~[0 1] ~[1 2]]
dojo: naked generator failure
```

##  Solutions

_These solutions were submitted by the Urbit community as part of a competition in ~2024.3.  They are made available under the MIT License and CC0.  We ask you to acknowledge authorship should you utilize these elsewhere._

### Solution #1

_An efficient and clear solution by ~dabmul-matdel._

```hoon
::  sizes.hoon
::
::  Given a map with islands find the size of the largest one.
::
|=  input=(list (list @ud))
^-  @ud
::  total number of rows
::
=/  nrows  (lent input)
::  row index
::
=|  i=@ud
::  map from initial island-id to final island-id
::
=|  islands=(map @ud @ud)
::  map from final-island id to island size
::
=|  sizes=(map @ud @ud)
::  map from cell coordinates to initial island-id
::
=|  cells=(map [@ud @ud] @ud)
::  previous row accessed in the loop
::
=|  prev-row=(list @ud)
::  previous number of columns in the previous row
::
=|  prev-ncols=@ud
|^
::  nested loop, outer loop
::
=*  outer  $
::  parsed all rows, exit
::
?:  =(i nrows)
  (max-value sizes)
::  current row
::
=/  row  (snag i input)
::  number of columns in current row
::
=/  ncols=@ud  (lent row)
::  raise error if mismatch in number of columns
::
?>  |(=(prev-ncols 0) =(ncols prev-ncols))
::  columns index
::
=|  j=@ud
::  nested loop, inner loop
::
|-  ^-  @ud
=*  inner  $
::  parsed all columns, next row
::
?:  =(j ncols)
  outer(i +(i), prev-row row, prev-ncols ncols)
::  error if cell value is not 0 or 1
::
?>  (lth (snag j row) 2)
::  if cell value is 1 we are in an island
::
?:  =((snag j row) 1)
  ::  is the cell above an island?
  ::
  ?:  &((gth i 0) =((snag j prev-row) 1))
    =/  island-id=@ud  (get-island i j %up)
    ::  are the islands left and above our current cell connected?
    ::
    ?:  &((gth j 0) =((snag (sub j 1) row) 1))
      =/  left-island-id  (get-island i j %left)
      :: if so just grow the island
      ::
      ?:  =(island-id left-island-id)
        =/  new  (grow-island i j island-id)
        %=  inner
          sizes  sizes.new
          cells  cells.new
          j  +(j)
        ==
      ::  otherwise merge islands left and above, and grow the merged island
      ::
      =/  new  (merge-and-grow-islands i j island-id left-island-id)
      %=  inner
        islands  islands.new
        sizes  sizes.new
        cells  cells.new
        j  +(j)
      ==
    ::  otherwise just grow the island
    ::
    =/  new  (grow-island i j island-id)
    %=  inner
      sizes  sizes.new
      cells  cells.new
      j  +(j)
    ==
  ::  is the cell to our left an island?
  ::
  ?:  &((gth j 0) =((snag (sub j 1) row) 1))
    :: if so just grow the island
    ::
    =/  island-id  (get-island i j %left)
    =/  new  (grow-island i j island-id)
    %=  inner
      sizes  sizes.new
      cells  cells.new
      j  +(j)
    ==
  ::  otherwise create a new island
  ::
  =/  new  (new-island i j)
  %=  inner
    islands  islands.new
    sizes  sizes.new
    cells  cells.new
    j  +(j)
  ==
::  nothing to do
::
inner(j +(j))
++  max-value
  ::    return the maximum value of a map
  ::
  ::  my-map: map with @ud key-value pairs
  ::
  |=  [my-map=(map @ud @ud)]
  ^-  @ud
  (~(rep by my-map) |=([[k=@ud v=@ud] cur=@ud] ?:((gth v cur) v cur)))
++  get-island
  ::    return the island id left or above given coordinates
  ::
  ::  i: row index
  ::  j: column index
  ::  dir: direction
  ::
  |=  [i=@ud j=@ud dir=?(%left %up)]
  ^-  @ud
  =<  +
  %-  ~(get by islands)
  ?-  dir
  %up  +:(~(get by cells) [(sub i 1) j])
  %left  +:(~(get by cells) [i (sub j 1)])
  ==
++  new-island
  ::    create a new island at given coordinates
  ::
  ::  i: row index
  ::  j: column index
  ::
  |=  [i=@ud j=@ud]
  =/  island-id  (add ~(wyt by islands) 1)
  [
  islands=(~(put by islands) island-id island-id)
  sizes=(~(put by sizes) island-id 1)
  cells=(~(put by cells) [i j] island-id)
  ]
++  grow-island
  ::    grow island at given coordinates with given id
  ::
  ::  i: row index
  ::  j: column index
  ::  island-id: island id
  ::
  |=  [i=@ud j=@ud island-id=@ud]
  [
  sizes=(~(put by sizes) island-id +(+:(~(get by sizes) island-id)))
  cells=(~(put by cells) [i j] island-id)
  ]
++  merge-and-grow-islands
  ::    merge two islands at given coordinates with given ids
  ::
  ::  i: row index
  ::  j: column index
  ::  island-id: island id
  ::  other-island-id: island id of other island
  ::
  |=  [i=@ud j=@ud island-id=@ud other-island-id=@ud]
  =/  sizes  (~(put by sizes) island-id (add +:(~(get by sizes) other-island-id) +:(~(get by sizes) island-id)))
  [
    islands=(~(put by islands) other-island-id island-id)
    sizes=(~(put by sizes) island-id +(+:(~(get by sizes) island-id)))
    cells=(~(put by cells) [i j] island-id)
  ]
--
```



### Solution #2
_An excellent solution by ~ramteb-tinmut._

```hoon
::  islands.hoon
::  Just the wind and the sea, and the stars to guide you.
::
|=  archipelago=(list (list @ud))
^-  @ud
=/  greatest-isle  0
=<
=/  stretch  (lent archipelago)
=/  span  (lent (snag 0 archipelago))
:: Validate the incoming dataset - or else wreck
::
?:  !(levy archipelago |=(row=(list @ud) &(=((lent row) span) (levy row |=(cell=@ud (lth cell 2))))))
  !!
:: All hands make-sail, t'gansuls and courses - stand by the braces!
::
(voyage [archipelago stretch span 0 0 0])
|%
++  voyage
  |=  [archipelago=(list (list @ud)) stretch=@ud span=@ud lat=@ud long=@ud greatest-isle=@ud]
  ^-  @ud
  :: Completion - set the royals and stunsails, return to port
  ?:  =(lat (lent archipelago))
    greatest-isle
  :: Edge of the map: great serpents barr our course [~] ... turn south
  ::
  =/  course  (snag lat archipelago)
  ?:  =(long (lent course))
    $(long 0, lat +(lat))
  :: Land ho? (ie cell == 1)
  :: 
  ?:  =((snag long course) 1)
    :: Explore the extents of new land
    ::
    =/  newfound-land  0
    =/  revised-map  `(list (list @ud))`~
    =^  newfound-land  revised-map
      (landing-party [archipelago lat long stretch span 0])
    :: Maybe update the largest found island?
    ::
    ?:  (gth newfound-land greatest-isle)
      $(long +(long), archipelago revised-map, greatest-isle newfound-land)
    $(long +(long), archipelago revised-map)
  :: Just the endless ocean. Sail East
  ::
  $(long +(long), archipelago (snap archipelago lat (snap course long 8)))
++  landing-party
  |=  [archipelago=(list (list @ud)) lat=@ud long=@ud stretch=@ud span=@ud size=@ud]
  ^-  [@ud (list (list @ud))]
  :: Check if current cell is (still) land - and not already visited
  ::
  ?:  =((snag long (snag lat archipelago)) 1)
    ::  Make note of our location, before the rum starts flowing - then explore
    ::
    =/  new-size  +(size)
    =/  revised-map  (snap archipelago lat (snap (snag lat archipelago) long 8))
    :: North
    ::
    =^  new-size  revised-map
      ?:  !=(lat 0)
        $(lat (dec lat), archipelago revised-map, size new-size) 
      [new-size revised-map]
    :: South
    ::
    =^  new-size  revised-map
      ?:  !=(lat (dec stretch))
        $(lat +(lat), archipelago revised-map, size new-size)
      [new-size revised-map]
    :: East
    ::
    =^  new-size  revised-map
      ?:  !=(long (dec span))
        $(long +(long), archipelago revised-map, size new-size)
      [new-size revised-map]
    :: West
    ::
    =^  new-size  revised-map
      ?:  !=(long 0)
        $(long (dec long), archipelago revised-map, size new-size)
      [new-size revised-map]
    [new-size revised-map]
  ::  No more lands - ¡rückkehr zum schiff! 
  ::
  [size archipelago]
--
```

##  Unit Tests

Following a principle of test-driven development, the unit tests below allow us to check for expected behavior. To run the tests yourself, follow the instructions in the [Unit Tests](userspace/apps/guides/unit-tests) section.

```hoon
/+  *test
/=  islands  /gen/islands
|%
::  tests for success
++  test-01
  %+  expect-eq
    !>  `@ud`1
    !>  %-  islands
        ~[~[1]]
++  test-02
  %+  expect-eq
    !>  `@ud`0
    !>  %-  islands
        ~[~[0]]
++  test-03
  %+  expect-eq
    !>  `@ud`0
    !>  %-  islands
        :~  
        ~[0 0]
        ~[0 0]
        ==
++  test-04
  %+  expect-eq
    !>  `@ud`1
    !>  %-  islands
        :~  
        ~[1 0]
        ~[0 0]
        ==
++  test-05
  %+  expect-eq
    !>  `@ud`1
    !>  %-  islands
        :~  
        ~[0 1]
        ~[0 0]
        ==
++  test-06
  %+  expect-eq
    !>  `@ud`1
    !>  %-  islands
        :~  
        ~[0 0]
        ~[1 0]
        ==
++  test-07
  %+  expect-eq
    !>  `@ud`1
    !>  %-  islands
        :~  
        ~[0 0]
        ~[0 1]
        ==
++  test-08
  %+  expect-eq
    !>  `@ud`2
    !>  %-  islands
        :~  
        ~[1 1]
        ~[0 0]
        ==
++  test-09
  %+  expect-eq
    !>  `@ud`2
    !>  %-  islands
        :~  
        ~[1 0]
        ~[1 0]
        ==
++  test-10
  %+  expect-eq
    !>  `@ud`2
    !>  %-  islands
        :~  
        ~[0 0]
        ~[1 1]
        ==
++  test-11
  %+  expect-eq
    !>  `@ud`2
    !>  %-  islands
        :~  
        ~[0 1]
        ~[0 1]
        ==
++  test-12
  %+  expect-eq
    !>  `@ud`1
    !>  %-  islands
        :~  
        ~[1 0]
        ~[0 1]
        ==
++  test-13
  %+  expect-eq
    !>  `@ud`1
    !>  %-  islands
        :~  
        ~[0 1]
        ~[1 0]
        ==
++  test-14
  %+  expect-eq
    !>  `@ud`3
    !>  %-  islands
        :~  
        ~[0 1]
        ~[1 1]
        ==
++  test-15
  %+  expect-eq
    !>  `@ud`3
    !>  %-  islands
        :~  
        ~[1 0]
        ~[1 1]
        ==
++  test-16
  %+  expect-eq
    !>  `@ud`3
    !>  %-  islands
        :~  
        ~[1 1]
        ~[0 1]
        ==
++  test-17
  %+  expect-eq
    !>  `@ud`3
    !>  %-  islands
        :~  
        ~[1 1]
        ~[1 0]
        ==
++  test-18
  %+  expect-eq
    !>  `@ud`4
    !>  %-  islands
        :~  
        ~[1 1]
        ~[1 1]
        ==
++  test-19
  %+  expect-eq
    !>  `@ud`4
    !>  %-  islands
        :~  
        ~[1 1 0]
        ~[1 1 0]
        ==        
++  test-20
  %+  expect-eq
    !>  `@ud`2
    !>  %-  islands
        :~  
        ~[1 0 1]
        ~[1 0 1]
        ==    
++  test-21
  %+  expect-eq
    !>  `@ud`2
    !>  %-  islands
        :~  
        ~[0 0 1]
        ~[1 0 1]
        ==   
++  test-22
  %+  expect-eq
    !>  `@ud`5
    !>  %-  islands
        :~  
        ~[0 1 1]
        ~[1 1 1]
        ==     
++  test-23
  %+  expect-eq
    !>  `@ud`3
    !>  %-  islands
        :~  
        ~[0 1 1]
        ~[1 0 1]
        ==     
++  test-24
  %+  expect-eq
    !>  `@ud`2
    !>  %-  islands
        :~  
        ~[0 1 0]
        ~[0 1 0]
        ==  
++  test-25
  %+  expect-eq
    !>  `@ud`2
    !>  %-  islands
        :~  
        ~[0 1 1]
        ~[1 0 0]
        ==  
++  test-26
  %+  expect-eq
    !>  `@ud`2
    !>  %-  islands
        :~  
        ~[1 0 1]
        ~[1 0 0]
        ==
++  test-27
  %+  expect-eq
    !>  `@ud`2
    !>  %-  islands
        :~  
        ~[1 1 0]
        ~[0 0 1]
        ==
:: random grids
++  test-28
  %+  expect-eq
    !>  `@ud`5
    !>  %-  islands
        :~  
        ~[0 1 1 1 1]
        ~[0 0 1 0 0]
        ~[0 0 0 0 0]
        ~[0 1 0 0 0]
        ~[0 1 0 0 1]
        ==
++  test-29
  %+  expect-eq
    !>  `@ud`5
    !>  %-  islands
        :~  
        ~[0 0 1 0 1]
        ~[0 1 0 1 0]
        ~[0 1 0 0 1]
        ~[0 1 0 1 1]
        ~[0 0 1 1 0]
        ==
++  test-30
  %+  expect-eq
    !>  `@ud`5
    !>  %-  islands
        :~  
        ~[1 1 0 1 1]
        ~[1 1 0 1 1]
        ~[1 0 1 0 0]
        ~[0 0 0 0 1]
        ~[0 0 0 1 0]
        ==
++  test-31
  %+  expect-eq
    !>  `@ud`20
    !>  %-  islands
        :~  
        ~[0 1 1 0 1 1 0 0 0 1]
        ~[0 1 0 0 1 0 1 0 0 0]
        ~[1 1 0 1 1 1 1 0 1 1]
        ~[0 0 1 0 0 1 1 0 0 1]
        ~[1 0 0 0 0 0 1 1 0 0]
        ~[1 1 0 1 1 1 0 1 1 0]
        ~[1 1 1 1 1 1 0 0 0 1]
        ~[1 1 1 0 0 0 0 1 0 0]
        ~[1 1 1 0 0 1 0 1 1 1]
        ~[1 1 0 1 0 1 1 1 0 0]
        ==
++  test-32
  %+  expect-eq
    !>  `@ud`18
    !>  %-  islands
        :~  
        ~[1 1 1 1 1 1 1 0 1 1]
        ~[1 0 1 0 1 1 1 1 1 0]
        ~[0 1 0 1 0 0 1 1 0 1]
        ~[1 0 1 1 0 1 0 0 0 1]
        ~[0 1 0 1 0 1 0 0 0 1]
        ~[1 1 0 1 1 1 1 0 0 0]
        ~[1 0 1 0 0 0 0 1 0 0]
        ~[1 0 0 1 1 1 0 1 1 1]
        ~[0 1 1 1 0 1 0 1 0 0]
        ~[0 1 0 0 0 0 1 0 1 0]
        ==
++  test-33
  %+  expect-eq
    !>  `@ud`10
    !>  %-  islands
        :~  
        ~[1 0 1 1 1 0 1 1 0 1]
        ~[0 0 1 0 1 1 0 0 1 0]
        ~[1 0 1 0 0 0 1 1 0 1]
        ~[1 0 0 0 1 0 0 1 1 0]
        ~[0 0 1 0 0 1 1 0 0 1]
        ~[0 0 0 1 1 0 0 0 0 0]
        ~[1 0 1 0 1 1 1 1 0 1]
        ~[0 1 0 1 1 1 0 0 0 1]
        ~[0 1 0 1 0 0 0 0 1 1]
        ~[1 0 0 0 0 0 0 0 1 0]
        ==
++  test-34
  %+  expect-eq
    !>  `@ud`1
    !>  %-  islands
        :~  
        ~[0 0 0 0 0 0 0 0 0 0]
        ~[1 0 1 0 0 0 1 0 0 0]
        ~[0 0 0 0 0 0 0 0 0 0]
        ~[0 0 0 0 0 1 0 0 0 0]
        ~[0 1 0 0 0 0 0 0 0 0]
        ~[0 0 1 0 0 0 0 0 0 0]
        ~[0 0 0 0 1 0 0 0 0 0]
        ~[0 0 0 0 0 0 1 0 1 0]
        ~[1 0 0 0 0 0 0 0 0 0]
        ~[0 1 0 0 1 0 0 0 0 0]
        ==
++  test-35
  %+  expect-eq
    !>  `@ud`6
    !>  %-  islands
        :~  
        ~[0 1 0 1 0 0 1 0 0 1]
        ~[0 0 0 1 0 0 0 0 0 0]
        ~[1 0 1 0 1 0 0 0 0 1]
        ~[0 1 0 0 0 0 1 1 0 0]
        ~[1 0 0 0 0 0 1 0 1 0]
        ~[0 0 0 0 1 0 1 0 0 0]
        ~[0 0 0 0 1 0 0 0 1 0]
        ~[0 0 0 0 0 1 1 0 1 0]
        ~[1 0 0 0 0 1 1 1 0 0]
        ~[0 0 0 0 0 1 0 0 0 0]
        ==
++  test-36
  %+  expect-eq
    !>  `@ud`6
    !>  %-  islands
        :~  
        ~[1 0 1 0 0 0 0 0 0 1 0 1 0 1 0]
        ~[0 0 0 0 0 1 0 0 0 0 1 0 0 1 0]
        ~[1 1 0 0 0 0 1 0 1 1 0 0 1 0 1]
        ~[1 0 0 1 0 0 1 0 0 0 1 0 0 0 0]
        ~[0 1 1 1 0 0 0 0 0 0 0 1 0 0 0]
        ~[0 0 0 0 0 1 0 0 0 1 0 0 0 0 0]
        ~[0 0 0 0 0 0 1 0 1 0 0 1 0 0 1]
        ~[0 0 0 0 0 1 0 1 0 0 0 1 1 0 0]
        ~[0 0 0 0 1 0 1 0 0 0 1 1 0 0 0]
        ~[0 0 1 0 0 0 1 1 0 1 0 0 0 0 0]
        ~[0 1 1 0 0 0 1 0 0 0 0 1 0 0 0]
        ~[1 1 0 0 0 1 0 0 0 0 0 0 0 1 0]
        ~[1 0 0 0 0 1 0 0 0 1 0 0 0 1 1]
        ~[0 0 0 1 0 0 1 0 0 1 0 1 0 1 0]
        ~[0 1 0 0 0 0 0 1 0 0 0 1 1 0 1]
        ==
++  test-37
  %+  expect-eq
    !>  `@ud`4
    !>  %-  islands
        :~  
        ~[0 1 0 0 0 1 0 0 0 0 1 0 1 0 0]
        ~[0 1 0 1 1 0 0 1 0 0 0 1 0 0 1]
        ~[0 1 0 0 1 0 1 1 1 0 0 0 0 0 0]
        ~[0 1 0 0 0 0 0 0 0 0 0 0 0 0 0]
        ~[0 0 1 0 0 0 1 0 1 0 0 0 0 1 0]
        ~[0 0 0 1 1 0 1 0 0 1 0 0 0 0 0]
        ~[1 0 0 1 0 1 0 0 0 0 0 0 0 0 0]
        ~[0 0 0 0 1 0 0 0 1 0 0 0 0 1 0]
        ~[0 0 0 0 0 0 0 0 0 0 1 0 0 0 0]
        ~[0 1 0 0 0 1 0 0 0 0 0 0 0 0 0]
        ~[0 1 0 0 0 0 0 1 0 0 1 0 1 0 0]
        ~[0 0 0 1 0 0 0 0 0 0 0 0 0 0 0]
        ~[0 1 0 0 0 1 0 0 0 0 1 1 0 1 0]
        ~[0 0 0 0 0 0 0 0 0 0 1 0 1 0 0]
        ~[0 1 1 0 0 0 0 0 0 0 1 0 0 0 0]
        ==
++  test-38
  %+  expect-eq
    !>  `@ud`21
    !>  %-  islands
        :~  
        ~[1 1 0 0 0 0 1 0 0 0 0 0 1 0 1]
        ~[1 0 0 1 0 0 0 0 0 0 1 1 1 0 1]
        ~[0 0 0 0 0 1 1 0 1 0 1 1 0 1 0]
        ~[1 0 1 0 0 0 0 1 1 0 0 0 0 0 0]
        ~[1 0 0 0 0 1 0 0 1 0 0 0 1 1 0]
        ~[0 0 0 1 0 0 1 0 1 0 0 1 0 1 0]
        ~[1 0 1 0 0 0 0 0 1 1 0 1 0 1 1]
        ~[0 1 1 0 0 0 0 0 1 0 1 0 1 0 0]
        ~[1 0 1 1 0 1 0 0 0 0 0 0 1 1 0]
        ~[0 1 0 1 1 0 0 0 1 1 1 0 0 1 0]
        ~[0 1 0 0 1 1 0 0 0 1 1 0 0 0 0]
        ~[0 0 1 0 0 0 1 1 1 1 1 0 1 0 0]
        ~[0 1 1 1 1 1 1 0 0 0 1 0 0 0 1]
        ~[0 0 0 0 0 1 1 0 0 1 0 0 0 0 0]
        ~[0 0 0 0 0 0 1 0 0 0 1 0 1 0 1]
        ==
++  test-39
  %+  expect-eq
    !>  `@ud`9
    !>  %-  islands
        :~  
        ~[0 0 1 1 0 1 1 0 0 0 0 0 0 0 0]
        ~[0 1 0 0 0 0 1 0 0 1 0 1 0 0 0]
        ~[1 1 1 0 0 0 1 0 0 0 1 0 0 0 0]
        ~[0 0 0 1 0 0 0 0 1 0 0 1 1 0 0]
        ~[1 0 1 0 0 0 0 1 0 1 0 0 1 1 1]
        ~[0 1 1 1 0 0 1 0 0 0 0 0 1 0 1]
        ~[0 0 1 1 0 0 0 1 1 0 1 0 0 0 0]
        ~[0 0 0 0 0 0 0 0 0 0 0 0 1 0 0]
        ~[1 1 0 1 1 0 0 1 1 0 1 0 1 0 1]
        ~[0 0 0 0 0 0 1 0 0 1 0 0 0 0 1]
        ~[0 0 0 1 1 0 1 0 0 0 0 0 1 0 1]
        ~[1 1 0 0 0 0 0 0 1 0 0 0 1 0 1]
        ~[0 0 1 1 1 0 1 0 0 0 0 1 0 1 0]
        ~[1 1 0 0 1 1 0 1 0 1 1 0 0 0 0]
        ~[0 0 1 1 1 1 0 0 0 0 1 0 0 1 1]
        ==
:: test for crash
++  test-40
    %-  expect-fail
    |.  %-  islands
        :: digit greater than 1 in matrix
        :~
        ~[0 0 1 1 0 1 1 0 0 0 0 0 0 0 0]
        ~[0 1 0 0 0 0 1 0 0 1 0 1 0 0 0]
        ~[1 1 1 0 0 0 1 0 0 0 1 0 0 0 0]
        ~[0 0 0 1 0 0 0 0 1 0 0 1 1 0 0]
        ~[1 0 1 0 0 0 0 1 0 1 0 0 1 1 1]
        ~[0 1 1 1 0 0 1 0 0 0 2 0 1 0 1]
        ~[0 0 1 1 0 0 0 1 1 0 1 0 0 0 0]
        ~[0 0 0 0 0 0 0 0 0 0 0 0 1 0 0]
        ~[1 1 0 1 1 0 0 1 1 0 1 0 1 0 1]
        ~[0 0 0 0 0 0 1 0 0 1 0 0 0 0 1]
        ~[0 0 0 1 1 0 1 0 0 0 0 0 1 0 1]
        ~[1 1 0 0 0 0 0 0 1 0 0 0 1 0 1]
        ~[0 0 1 1 1 0 1 0 0 0 0 1 0 1 0]
        ~[1 1 0 0 1 1 0 1 0 1 1 0 0 0 0]
        ~[0 0 1 1 1 1 0 0 0 0 1 0 0 1 1]
        ==
++  test-41
    %-  expect-fail
    |.  %-  islands
        :: one row too short
        :~  
        ~[1 1 0 0 0 0 1 0 0 0 0 0 1 0 1]
        ~[1 0 0 1 0 0 0 0 0 0 1 1 1 0 1]
        ~[0 0 0 0 0 1 1 0 1 0 1 1 0 1 0]
        ~[1 0 1 0 0 0 0 1 1 0 0 0 0 0 0]
        ~[1 0 0 0 0 1 0 0 1 0 0 0 1 1 0]
        ~[0 0 0 1 0 0 1 0 1 0 0 1 0 1 0]
        ~[1 0 1 0 0 0 0 0 1 1 0 1 0 1 1]
        ~[0 1 1 0 0 0 0 0 1 0 1 0 1 0]
        ~[1 0 1 1 0 1 0 0 0 0 0 0 1 1 0]
        ~[0 1 0 1 1 0 0 0 1 1 1 0 0 1 0]
        ~[0 1 0 0 1 1 0 0 0 1 1 0 0 0 0]
        ~[0 0 1 0 0 0 1 1 1 1 1 0 1 0 0]
        ~[0 1 1 1 1 1 1 0 0 0 1 0 0 0 1]
        ~[0 0 0 0 0 1 1 0 0 1 0 0 0 0 0]
        ~[0 0 0 0 0 0 1 0 0 0 1 0 1 0 1]
        ==
++  test-42
    %-  expect-fail
    |.  %-  islands
        :: one row too long
        :~  
        ~[1 1 0 0 0 0 1 0 0 0 0 0 1 0 1]
        ~[1 0 0 1 0 0 0 0 0 0 1 1 1 0 1]
        ~[0 0 0 0 0 1 1 0 1 0 1 1 0 1 0]
        ~[1 0 1 0 0 0 0 1 1 0 0 0 0 0 0]
        ~[1 0 0 0 0 1 0 0 1 0 0 0 1 1 0]
        ~[0 0 0 1 0 0 1 0 1 0 0 1 0 1 0]
        ~[1 0 1 0 0 0 0 0 1 1 0 1 0 1 1 1]
        ~[0 1 1 0 0 0 0 0 1 0 1 0 1 0 0]
        ~[1 0 1 1 0 1 0 0 0 0 0 0 1 1 0]
        ~[0 1 0 1 1 0 0 0 1 1 1 0 0 1 0]
        ~[0 1 0 0 1 1 0 0 0 1 1 0 0 0 0]
        ~[0 0 1 0 0 0 1 1 1 1 1 0 1 0 0]
        ~[0 1 1 1 1 1 1 0 0 0 1 0 0 0 1]
        ~[0 0 0 0 0 1 1 0 0 1 0 0 0 0 0]
        ~[0 0 0 0 0 0 1 0 0 0 1 0 1 0 1]
        ==
--
```
