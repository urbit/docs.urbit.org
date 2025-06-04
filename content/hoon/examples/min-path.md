# Minimum Path Sum

## Challenge: Minimum Path Sum {#challenge-minimum-path-sum}

You are given a 2D grid of positive whole numbers, represented as a `(list (list @ud))` You start in the top left corner of the grid, and your goal is to walk to the botttom right corner by taking steps either down or to the right. Your goal is to find the path that minimizes the sum of the numbers on the path.

Your task for this challenge is to write a generator that takes a `(list (list @ud))` and returns a `@ud` representing the minimum sum of numbers on a path from top left to bottom right.

Example usage:
```
> +min-path ~[~[1 3 1] ~[1 5 1] ~[4 2 1]]
7
```

Here you can see the above grid represented visually, and the minimum path totaling 7 that goes straight right then straight down.

```
1  3  1
1  5  1
4  2  1
```

## Solutions {#solutions}

_These solutions were submitted by the Urbit community as part of a competition in ~2024.8.  They are made available under the MIT License and CC0.  We ask you to acknowledge authorship should you utilize these elsewhere._

### Solution #1 {#solution-1}

_The speed winner, and a very effective and clear solution by ~diblud-ricbet._

```hoon
::  min-path.hoon
::  Find the cheapest way of traversing a grid of costs from the top left
::  to the bottom right, moving only right and down.
::
|=  grid=(list (list @ud))
^-  @ud
::  Input: 2D (n x n) grid of costs to go through a square.
::  Output: Cheapest path from top left to bottom right.
::
=/  num-rows  (lent grid)
=/  num-columns  (lent (snag 0 grid))
::  Number of rows and number of columns in the grid.
::
=/  destination-costs  (reap num-rows (reap num-columns 0))
::  Initially, prepopulate destination-costs with 0s, the same
::  dimesions as grid. The tactic is to replace the 0 in destination-costs
::  at an index with the actual cheapeast cost of going from the top left
::  to that index.
::
::  We do so in a "diagonal" order of indices, since, if we know the cheapest
::  cost of getting to any squares a distance d from the top-left, we can
::  calculate quickly the cheapest cost of getting to any squares a distance
::  d+1 from the top left.
::
=/  row-index  0
=/  column-index  0
::  row-index and column-index keep track of what square we're actually on.
::
|-
=.  destination-costs
::  Change destination-costs to be...
::
%^  snap  destination-costs  row-index
%^  snap  (snag row-index destination-costs)  column-index
::  the current destination-costs but with (row-index, column-index)
::  replaced by the value computed below:
::
?:  &(=(row-index 0) =(column-index 0))
  (snag column-index (snag row-index grid))
  ::  If we're at (0, 0), the cost is going to be just grid[0][0].
  ::
?:  =(row-index 0)
  %+  add
  (snag column-index (snag row-index grid))
  (snag (sub column-index 1) (snag row-index destination-costs))
  ::  Else, if we're at (0, column-index), the cost is going to be
  ::  grid[0][column-index] + destination_costs[0][column-index - 1]
  ::
?:  =(column-index 0)
  %+  add
  (snag column-index (snag row-index grid))
  (snag column-index (snag (sub row-index 1) destination-costs))
  ::  Else, if we're at (row-index, 0), the cost is going to be
  ::  grid[row-index][0] + destination_costs[row-index - 1][0]
  ::
%+  add
(snag column-index (snag row-index grid))
%+  min
(snag (sub column-index 1) (snag row-index destination-costs))
(snag column-index (snag (sub row-index 1) destination-costs))
::  Else, the cost is going to be grid[row-index][column-index] +
::  min(
::    destination-costs[row-index][column-index - 1],
::    destination-costs[row-index - 1][column-index]
::  )
::
?:  &(=(row-index (sub num-rows 1)) =(column-index (sub num-columns 1)))
  (snag column-index (snag row-index destination-costs))
  ::  If we're in the bottom right, produce the answer.
  ::
?:  |(=(column-index 0) =(row-index (sub num-rows 1)))
  ?:  (lth :(add row-index column-index 1) num-columns)
    %=  $
    row-index  0
    column-index  :(add row-index column-index 1)
    ==
  %=  $
  row-index  (sub :(add row-index column-index 2) num-columns)
  column-index  (sub num-columns 1)
  ==
  ::  Else, if we've reached the end of our diagonal, restart again from
  ::  the top right of the next diagonal. Two cases for whether the new
  ::  diagonal starts on the top row or last column.
  ::
%=  $
row-index  +(row-index)
column-index  (sub column-index 1)
==
::  Else, keep moving along the diagonal.
::
```



### Solution #2 {#solution-2}
_Another good solution by ~norweg-rivlex._

```hoon
::  min-path.hoon
::  barebones a* implementation, using a sorted list
::  because I couldn't find a handy min-heap/priority
::  queue type thing, using basic distance to the goal
::  as the heuristic.
::
|=  grid=(list (list @ud))
^-  @ud
=/  max-y=@ud  (sub (lent grid) 1)
=/  max-x=@ud  (sub (lent (snag 0 grid)) 1)
::
::  the value at a position in the grid
=/  get-xy
  |=  [x=@ud y=@ud]
  ^-  @ud
  (snag x (snag y grid))
::
::  how many items still have to be added from a 
::  position in the grid
=/  dist-to-goal
  |=  [x=@ud y=@ud]
  ^-  @ud
  (add (sub max-x x) (sub max-y y))
::
::  data structure containing the search state at
::  each point in the grid, tot as the sum of the 
::  grid items so far visited, cmp as the heuristic
::  weight, x, y as the grid location
=/  search-pt  ,[tot=@ud cmp=@ud x=@ud y=@ud]
::
::  get the search point one step to the right in the
::  grid from the passed search point, if not at limit
=/  next-right
  |=  p=search-pt
  ^-  (unit search-pt)
  ?:  =(x.p max-x)  ~
  =/  x  +(x.p)
  =/  tot  (add tot.p (get-xy x y.p))
  =/  cmp  (add tot (dist-to-goal x y.p))
  (some [tot cmp x y.p])
::
::  get the search point one step down in the grid
::  from the passed search point, if not at limit
=/  next-down
  |=  p=search-pt
  ^-  (unit search-pt)
  ?:  =(y.p max-y)  ~
  =/  y  +(y.p)
  =/  tot  (add tot.p (get-xy x.p y))
  =/  cmp  (add tot (dist-to-goal x.p y))
  (some [tot cmp x.p y])
::
::  insert a new search point to the correct location
::  in the passed frontier to maintain ordering by cmp
=/  add-frontier-pt
  |=  [f=(list search-pt) pt=search-pt]
  ?~  f  ~[pt]
  ?:  (gth cmp.i.f cmp.pt)  [pt f]
  [i.f $(f t.f)]
::
::  insert a number of new search points to the 
::  correct locations in the passed frontier
=/  add-frontier-pts
  |=  [f=(list search-pt) pts=(list search-pt)]
  ?~  pts  f
  $(f (add-frontier-pt f i.pts), pts t.pts)
::
::  the initial state of the frontier, containing the
::  search point for the top left item in the grid
=/  frontier=(list search-pt)  
  =/  top-left  (get-xy 0 0)
  =/  cmp  (add top-left (dist-to-goal 0 0))
  ~[[top-left cmp 0 0]]
::
::  main loop, getting the lowest cmp search point
::  from the frontier, getting the possible next points,
::  if there are none, we're done - return the tot
::  value; otherwise loop, updating the frontier to
::  remove the current point and insert its neighbours
|-
  ?~  frontier  !!
  =/  p  i.frontier
  =/  r  (next-right p)
  =/  d  (next-down p)
  =/  pts-to-add  (murn ~[r d] |=(a=(unit search-pt) a))
  ?~  pts-to-add  tot.p
  $(frontier (add-frontier-pts t.frontier pts-to-add))
```

## Unit Tests {#unit-tests}

Following a principle of test-driven development, the unit tests below allow us to check for expected behavior. To run the tests yourself, follow the instructions in the [Unit Tests](../../build-on-urbit/guides/guides/unit-tests.md) section.

```hoon
/+  *test
/=  min-path  /gen/min-path
|%
++  test-01
  %+  expect-eq
    !>  `@ud`1
    !>  %-  min-path
        ~[~[1]]
++  test-02
  %+  expect-eq
    !>  `@ud`0
    !>  %-  min-path
        ~[~[0]]
++  test-03
  %+  expect-eq
    !>  `@ud`12
    !>  %-  min-path
        :~  
       ~[2 3]
       ~[8 7]
        ==
++  test-04
  %+  expect-eq
    !>  `@ud`5
    !>  %-  min-path
        :~  
        ~[0 0 4]
        ~[1 0 5]
        ~[8 4 1]
        ==
++  test-05
  %+  expect-eq
    !>  `@ud`21
    !>  %-  min-path
        :~  
        ~[6 3 1 8 1]
        ~[5 6 0 0 9]
        ~[0 0 4 5 6]
        ==
++  test-06
  %+  expect-eq
    !>  `@ud`27
    !>  %-  min-path
        :~  
        ~[2 3 2]
        ~[6 7 5]
        ~[5 8 6]
        ~[2 1 4]
        ~[1 9 7]
        ==
++  test-07
  %+  expect-eq
    !>  `@ud`28
    !>  %-  min-path
        :~  
        ~[7 4 9 4 2]
        ~[8 7 0 0 5]
        ~[3 3 3 3 3]
        ~[0 4 3 4 0]
        ~[8 6 8 1 4]
        ==
++  test-08
  %+  expect-eq
    !>  `@ud`46
    !>  %-  min-path
        :~  
       ~[5 4 3 6 1 1 9 7 5 8]
       ~[5 6 3 9 3 2 6 7 9 1]
       ~[6 7 8 5 6 1 9 5 9 7]
       ~[3 5 7 7 5 2 8 3 4 2]
       ~[3 8 3 8 8 2 4 1 0 6]
       ~[2 5 4 0 1 0 7 7 6 2]
       ~[1 9 4 5 9 1 0 7 1 9]
       ~[3 4 8 5 1 0 6 8 4 1]
       ~[3 1 8 0 6 0 9 2 7 4]
       ~[9 4 8 6 6 7 1 5 2 3]
        ==
++  test-09
  %+  expect-eq
    !>  `@ud`57
    !>  %-  min-path
        :~  
        ~[8 1 1 3 0 8 7 4 6 0]
        ~[1 9 7 9 8 0 2 2 5 2]
        ~[4 5 1 7 7 4 8 8 1 7]
        ~[0 6 1 1 2 8 8 5 9 8]
        ~[6 1 9 8 8 2 4 9 1 9]
        ~[5 6 4 2 9 4 9 9 3 1]
        ~[6 5 9 0 0 4 5 4 2 5]
        ~[3 0 3 7 7 8 0 3 7 4]
        ~[9 5 0 0 3 3 7 5 7 3]
        ~[0 3 5 6 0 0 6 3 3 8]
        ==
++  test-10
  %+  expect-eq
    !>  `@ud`56
    !>  %-  min-path
        :~  
        ~[0 4 8 0 1 3 4 8 1 8 2 8 7 1 7]
        ~[4 5 9 1 3 2 4 4 3 4 0 2 6 6 3]
        ~[5 4 8 9 3 1 1 6 7 0 8 0 0 4 1] 
        ~[7 5 7 3 7 3 8 2 4 7 7 0 8 4 8]
        ~[7 1 1 1 1 0 8 1 2 5 4 6 5 9 0]
        ~[0 0 3 2 9 4 3 7 8 1 9 6 9 3 0]
        ~[9 4 9 6 4 0 0 3 3 6 4 6 8 8 2]
        ~[0 0 8 0 4 4 2 1 7 9 2 4 8 3 8]
        ~[1 0 7 6 4 2 9 3 5 5 7 1 3 8 3]
        ~[6 0 3 6 1 6 6 7 0 2 6 4 3 3 1]
        ==
++  test-11
  %+  expect-eq
    !>  `@ud`63
    !>  %-  min-path
        :~
        ~[6 5 9 2 5 9 9 6 1 4]
        ~[7 5 3 4 5 9 0 9 3 9]
        ~[2 5 2 7 7 4 4 0 9 9]
        ~[1 2 1 6 3 8 8 7 1 7]
        ~[8 1 2 4 8 0 2 7 4 3]
        ~[8 3 6 8 0 6 6 4 9 6]
        ~[2 3 5 4 4 9 8 2 7 3]
        ~[5 1 6 4 1 4 2 1 3 1]
        ~[2 6 1 6 1 0 2 5 7 4]
        ~[8 2 2 4 6 1 4 4 5 9]
        ~[6 0 5 3 2 8 4 2 6 2]
        ~[5 1 6 3 9 2 8 6 0 8]
        ~[3 0 7 1 3 2 4 6 3 0]
        ~[2 7 5 1 5 1 9 5 9 1]
        ~[3 2 5 5 4 1 9 1 5 4]
        ==
++  test-12
  %+  expect-eq
    !>  `@ud`65
    !>  %-  min-path
        :~
        ~[4 7 6 1 6 8 8 2 1 5 1 2 2 8 3]
        ~[6 8 0 8 6 4 9 7 6 1 7 3 1 9 9]
        ~[4 8 2 6 7 1 5 1 1 7 3 7 3 4 2]
        ~[7 7 5 9 6 0 0 5 0 2 3 9 0 5 3]
        ~[0 2 3 8 1 8 9 7 1 6 9 0 9 7 9]
        ~[1 4 1 5 7 6 6 1 3 8 9 6 9 7 6]
        ~[2 8 4 6 0 2 2 2 5 7 7 9 8 4 7]
        ~[0 4 1 1 5 4 7 3 9 1 4 6 1 3 2]
        ~[6 0 5 2 8 4 5 1 7 6 3 5 1 7 7]
        ~[4 1 7 2 9 0 7 0 1 4 8 1 1 9 1]
        ~[3 6 2 5 2 2 9 9 2 8 3 2 8 2 3]
        ~[1 8 1 7 2 3 0 2 1 3 6 3 1 2 9]
        ~[6 5 8 4 4 2 9 4 3 2 0 6 0 3 2]
        ~[7 1 1 0 8 8 7 2 7 7 3 7 7 3 3]
        ~[9 6 9 4 7 8 2 6 7 2 1 0 2 5 0]
        ==
--
```
