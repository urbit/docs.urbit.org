+++
title = "Emirp"
weight = 230
+++

## Challenge: Emirp

A prime number is a number that is only divisible by 1 and itself, for example, `7`. An [emirp](https://en.wikipedia.org/wiki/Emirp) is a prime number that results in a different prime when its decimal digits are reversed. For example, `107` and `701` are a pair of emirps, and `3,049` and `9,403`.

Palindromic numbers are not emirps. `101` is a prime and its reverse is itself -- it is not an emirp.

Your task for this challenge is write a generator that will add up all the first `n` emirps. To be precise, you should write a generator `emirp` which takes a `@ud` number `n` as an input, and returns a `@ud` number which is the sum of the first `n` emirps.

Example usage:
```
> +emirp 10
638
```

The first 10 emirps are `13, 17, 31, 37, 71, 73, 79, 97, 107, 113`, and their sum is `638`.

##  Solutions

_These solutions were submitted by the Urbit community as part of a competition in ~2024.3.  They are made available under the MIT License and CC0.  We ask you to acknowledge authorship should you utilize these elsewhere._

### Solution #1

_By ~nodmel-todsyr. A very fast and efficient solution._

```hoon
::  emirp.hoon
::  Finds a sum of first n emirp numbers
|^
|=  [n=@ud]
=/  i  0
=/  sum  0
=/  number  13
=|  emirps=(set @ud)
|-
?:  =(i n)
  sum
=^  x=@ud  emirps  (find-emirp number emirps)
%=  $
  i  +(i)
  sum  (add sum x)
  :: iterating only over 6k +- 1 numbers
  number  (add ?:(=((mod x 6) 1) 4 2) x)
==
::  Finds a smallest emirp which is greater than or equal to x.
::  Adds flipped emirp to the set of emirps
::  If emirp is in the set, returns it immediately
::
++  find-emirp
  |=  [x=@ud emirps=(set @ud)]
  ^-  [@ud (set @ud)]
  =/  flipped  (flip x)
  ?:  (~(has in emirps) x)
    [x emirps]
  ?:  &(!=(x flipped) (is-prime x) (is-prime flipped))
    [x (~(put in emirps) flipped)]
  $(x (add ?:(=((mod x 6) 1) 4 2) x))
::  Checks if x is a prime. 
::
++  is-prime
  |=  [x=@ud]
  ^-  ?
  ?:  (lte x 3)
    (gth x 1)
  ?:  |(=((mod x 2) 0) =((mod x 3) 0))
    %.n
  =/  limit  p:(sqt x)
  =/  j  5
  |-
  ?:  (gth j limit)
    %.y
  ?:  |(=((mod x j) 0) =((mod x (add 2 j)) 0))
    %.n
  $(j (add j 6))
::  Flips a number.
::
++  flip
  |=  [number=@ud]
  ^-  @ud
  =/  m  0
  =/  rip  (curr div 10)
  =/  last  (curr mod 10)
  |-
  ?:  =(number 0)
    m
  %=  $
    number  (rip number)
    m  (add (mul 10 m) (last number))
  ==
--
```



### Solution #2
_By ~ramteb-tinmut. Well-commented, easy to read, and fast._

```hoon
::  emirp.hoon
:: Return the sum of the first n emirp numbers
::
|=  target=@ud
=/  emirp-candidate  13  :: starting at the first emirp makes sense
=|  emirps=(list @ud)
=<
sieve
|%
++  sieve
  :: When the target is reached, sum the list of emirps
  ::
  ?:  =(target (lent emirps))
    |-
    ?~  emirps
      0
    (add i.emirps $(emirps t.emirps))
  :: Whilst below target, recurse on is-emirp after incrementing
  :: 
  %=  sieve
    emirps  (is-emirp emirp-candidate)
    emirp-candidate  (add emirp-candidate 1)
  ==
++  is-emirp
  |=  candidate=@ud
  =/  reversed  (reverse-ud candidate)
  :: Check if candidate number is a palindrome
  ::
  ?:  !=(reversed candidate)
    :: Is it also a prime?
    ::
    ?:  (is-prime [candidate (sqt candidate)])
      :: Check if the reverse is also a prime:
      ::
      ?:  (is-prime [reversed (sqt reversed)])
        :: Success! - store the emirp
        ::
        (into emirps 1 candidate)
      :: The reverse is not a prime:
      ::
      emirps
    :: Not prime
    ::
    emirps
  :: Palindrome & invalid
  ::  
  emirps
++  is-prime
  =/  divisor  2
  |=  [candidate=@ud root=[@ @]]  
  
  :: Fastest check first - has the divisor reached our input candidate? 
  ::
  ?:  =(candidate divisor)
    %.y
  :: Ensure non-zero modulo
  ::
  ?:  =((mod candidate divisor) 0)
    %.n
  :: If not a prime, then number must have a divisor less than or equal to its square root. There's an edge case if the square root is not a whole number, in which case we need to round up:
  ::
  ?:  &(=(+3.root 0) (gth divisor +2.root))
    %.y
  ?:  (gth divisor (add 1 +2.root))
    %.y
  :: Increment divisor and repeat
  ::
  %=  $
    divisor  (add divisor 1)
  ==

++  reverse-ud
  |=  number=@ud
  ^-  @ud
  =/  reversed  0
  :: Return reversed @ud when number reaches zero
  ::
  |-
    ?:  =(0 number)  
      reversed
    :: Otherwise loop until all digits are swapped:
    ::
    =.  reversed  (add (mul 10 reversed) (mod number 10))
    $(number (div number 10))  
--
```

##  Unit Tests

Following a principle of test-driven development, the unit tests below allow us to check for expected behavior. To run the tests yourself, follow the instructions in the [Unit Tests](/userspace/apps/guides/unit-tests) section.

```hoon
/+  *test
/=  emirp  /gen/emirp
|%
++  test-01
  %+  expect-eq
    !>  `@ud`13
    !>  (emirp 1)
++  test-02
  %+  expect-eq
    !>  `@ud`30
    !>  (emirp 2)
++  test-03
  %+  expect-eq
    !>  `@ud`169
    !>  (emirp 5)
++  test-04
  %+  expect-eq
    !>  `@ud`638
    !>  (emirp 10)
++  test-05
  %+  expect-eq
    !>  `@ud`6.857
    !>  (emirp 25)
++  test-06
  %+  expect-eq
    !>  `@ud`32.090
    !>  (emirp 50)
++  test-07
  %+  expect-eq
    !>  `@ud`115.370
    !>  (emirp 100)
++  test-08
  %+  expect-eq
    !>  `@ud`4.509.726
    !>  (emirp 500)
--
```