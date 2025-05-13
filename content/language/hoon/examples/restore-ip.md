# Restore IP

## Challenge: Restore IP Addresses

An IPv4 address consists of exactly four non-negative whole numbers, separated by single dots. Each number is between 0 and 255 (inclusive) and cannot have leading zeros, unless it is 0.

For example, the following are valid IPv4 addresses:
* `1.1.1.1`
* `255.255.255.255`
* `192.168.0.1`
* `23.25.1.194`

While the following are not:
* `01.1.1.01`
* `256.255.255.255`
* `192.168.00.1`
* `a23.b25.1.194`

A database containing IPv4 addresses has gotten out of order up by addresses losing their dots. Your job is to restore it. You'll write a generator `restore-ip` such that it takes a `@t` `cord` containing only numerical digits and returns a `set` of all the `@t` `cord`s with dots inserted into the given digits to create a valid IPv4 address. 

We also want to crash if the input given is clearly invalid. Your generator should crash in the following cases:
* If the input contains any characters other than digits.
* If the input length is greater than 12.


Example usage:
```
> +restore-ip '12345678'
{'1.234.56.78' '123.45.6.78' '12.34.56.78' '123.45.67.8' '123.4.56.78'}
```

```
> +restore-ip '1234567890123456'
dojo: naked generator failure
```

```
> +restore-ip '111a'
dojo: naked generator failure
```

##  Solutions

_These solutions were submitted by the Urbit community as part of a competition in ~2024.3.  They are made available under the MIT License and CC0.  We ask you to acknowledge authorship should you utilize these elsewhere._

### Solution #1

_By ~nodsup-halnux. Clearly written, well-commented, and very Hoonish._

```hoon
::  +restore-ip: An algorithm that takes a cord
::    of digits, and tries to generate valid ips.
::    If digit cord length is <4, returns ~
::    If digit cord length is >12, crashes (!!)
::    If non-numerics present, crashes (!!)
::    Otherwise, return a (set @t) of results.
::
|^
::  Bar-ket (|^) buck arm.
::    $ arm has control flow and tests basic cases
::    before handing off input tape to the main 
::    algorithm for finding IPs.
::    Returns a (set @t).
::
|=  [tcord=@t]
  ^-  (set @t)
  ::  We need a tape for our work. Convert.
  ::
  =/  ttape  (trip tcord)
  :: We use length twice, so pin a variable.
  ::
  =/  lentape  (lent ttape)
  :: Are all of our characters digits?  If not, crash
  ::
  ?.  =((lent (skip ttape is-digit)) 0)  !!
    :: Is our length less than 4? If so, return ~
    ::
    ?.  (gte lentape 4)
      `(set @t)`(silt `(list @t)`~)
      ::  Is our tape greater than 12?  If so, crash.
      ::
      ?.  ?!((gth lentape 12))  !!
        ::  Finally, lets call the algorithm.
        ::
        (first-loop ttape)
::  This is a structure used for generating our IPs
::  in the algorithm below. An IPv4 consists of four
::  octets (8 bits), making a 32 bit address.
::
+$  octets  $:  o1=tape
           o2=tape
         o3=tape
       o4=tape
    ==
::  ++is-digit: Checks to see if an inputed character
::    is a valid digit from 0-9.  Used by the skip
::    gate as a negative filter, to check for 
::    non-numeric characters in cord input.
::    Interestingly, our tapes are made up of @tD's, 
::    but checking equality with an @t works. 
::    Returns a loobean.
::
++  is-digit
|=  [c=@t]
  ^-  ?
  ::  Check if c is any numeric digit. Return true
  ::  If we find a digit.
  ::
  ?|  =(c '0')  =(c '1')  =(c '2')
    =(c '3')  =(c '4')  =(c '5')
    =(c '6')  =(c '7')  
    =(c '8')  =(c '9')
  ==
::  ++range-ok: Small gate for seeing if our octet
::    from the octets structure is between 1 and 255
::    (inclusive).  Note slav crashes if we have a 
::    cord that starts with zero - this is guarded
::    against by the ++check-ip control flow.
::    Returns a loobean.
::
++  range-ok
|=  [q=tape]
  ^-  ?
    =/  testnum  (slav %ud (crip q))
    &((gth testnum 0) (lth testnum 255))
::  ++check-ip:  Given a octet from the  octets struct
::    checks the following:  If first character is a 
::    zero AND length is 1, return %.y. Else, Check if 
::    our characters are < 4 in length, and number they
::    represent is in range.
::    Returns a loobean
::
++  check-ip
|=  [octet=tape]
  ^-  ?
    :: Prove octet not ~, expose i/t faces for use.
    ::
    ?~  octet  !!
      :: Is our first digit zero?
      ::
      ?:  =('0' i.octet)
        :: If it is, only a string of length 1 is valid
        ::
        ?:  =((lent octet) 1)
          %.y
        ::  Otherwise, return false.
        ::
        %.n
        ::If it is not zero, then test length and range
        ::
      ?:  &((lth (lent octet) 4) (range-ok octet))
          %.y
      :: Our length/range test failed, so return false.
      ::
      %.n
::  ++build-ip:  Given the  octets structure, build a
::    valid IP. Assumes we checked our octet and all 
::    tests passed.
::    Returns a cord.
::
++  build-ip
|=  [ip=octets]
  ^-  @t  (crip "{o1.ip}.{o2.ip}.{o3.ip}.{o4.ip}")
::  General comments about loops below:
::    Splitting up the loops into three gates makes it 
::    easier to read, with the drawback that our gate 
::    inputs for loops 2 and 3 get a bit long and our 
::    run-time might go up a bit.  As our input cords 
::    are no longer than 12 characters, computational 
::    efficiency isn't a serious issue.
::
::  ++first-loop:  First of three loops. Variable i is 
::    set, which represents the dot separation between 
::    our first and second octet, conceptually.
::    Calls second-loop, and then union merges the 
::    results into the result1 variable.
::    Returns a (set @t).
::
++  first-loop
|=  [iptape=tape]
  ^-  (set @t)
  ::  Paramters for our trap.
  ::
  =/  i  1
  =/  len  (lent iptape)
  =/  result1  `(set @t)`~
  |-  
    ^-  (set @t)
    ::  Is i less than tape length?
    ::
    ?:  (lth i len)
      ::If so, compute j, and call second-loop. Then 
      :: merge second loop results in to result1.
      ::
      =/  j  (add i 1)
      %=  $
        result1  (~(uni in result1) (second-loop i j iptape))
        i  +(i)
      ==
      ::If i bound is hit, return result1.
      ::
      result1
::  ++second-loop:  Structurally, this is the same
::    as first-loop.  Takes i and j as input,
::    and sets up k for third-loop.
::    Returns a (set @t)
::
++  second-loop
|=  [i=@ud j=@ud iptape=tape]
  ^-  (set @t)
  ::  Paramters for our trap.
  ::
  =/  result2  `(set @t)`~
  =/  len  (lent iptape)
  |-
    ^-  (set @t)
    ::  Is j less than tape length?
    ::
    ?:  (lth j len)
      ::  If so, compute k, and call third-loop. Then 
      ::  merge third loop results in to result2.
      ::  
      =/  k  (add j 1)
      %=  $
        result2  (~(uni in result2) (third-loop i j k iptape))
        j  +(j)
      ==
      ::If j bound is hit, return result1.
      result2
::  ++third-loop:  This is the main body of code for
::    generating IP addresses. It takes ijk and
::    finds octet, which are stored in the octets
::    structure. Validity checks (above) are called,
::    and if they pass, a valid IP is generated and
::    inserted into the results3 variable.
::    Returns a (set @t)
::
++  third-loop
|=  [i=@ud j=@ud k=@ud iptape=tape]
  ^-  (set @t)
  ::  Paramters for our trap.
  ::
  =/  len  (lent iptape)
  =/  result3  `(set @t)`~
  |-
    ^-  (set @t)
    ::  Is j less than tape length?
    ::
    ?:  (lth k len)
      ::  If so...now we do something different!
      ::  Pin gen-ip to sample, and insert each octet
      ::  into the octets structure. Use current ijk
      ::  to figure out our individual octets. 
      ::
      =/  gen-ip  
        ^-  octets  
          :^    o1=(limo (scag i iptape)) 
              o2=(limo (slag i (scag j iptape))) 
            o3=(limo (slag j (scag k iptape))) 
          o4=(limo (slag k iptape))
        ::  Main checks on octet. Do they all pass?
        ::
        ?:  ?&  (check-ip o1.gen-ip) 
                (check-ip o2.gen-ip) 
                (check-ip o3.gen-ip) 
                (check-ip o4.gen-ip)
            ==        
            ::  If they do, build a valid IP.
            ::  Place results in result3. Increase k.
            ::
            %=  $
                result3  (~(put in result3) (build-ip gen-ip))
                k  +(k)
            ==
            ::  If they do not, lets increase k and
            ::  try the next IP.
            ::
            %=  $
              k  +(k)
            ==
      ::  k has hit bound, return result3.
      ::
      result3
--
```



### Solution #2
_By ~ramteb-tinmut. Another great solution, well written and commented._

```hoon
::  restore-ip.hoon
::  A generator to parse valid IPv4 format addresses from an input cord
::
|=  input=@t
:: Ensure output type
::
^-  (set cord)
=<
:: cord to tape
::
=/  input-tape  (trip input)
:: Check for forbidden characters
::
?>  (validate-input input-tape)
:: Return an empty set if the tape is less than minimum required to form a valid IP
::
?:  (lth (lent input-tape) 4)
  `(set cord)`~
:: Otherwise proceed to create a set of possible valid ips
::
(do-tape [input-tape "" 1 0 `(set cord)`~])
|%

:: This is our core logic where the input tape is repeatedly parsed for combinations of IP octets, and the set of possible IPs is assembled
::
++  do-tape
  |=  [input-tape=tape found-ip=tape count=@ud found-octets=@ud ip-set=(set cord)]
  :: 4 found octets mean we may have a vali IP, if the tape is exhausted
  ::
  ?:  =(found-octets 4)
    ?:  =(0 (lent input-tape))
      (~(put in ip-set) (crip found-ip))
    ip-set
  :: If we haven't got a full set of octets, and our remaining tape can't be split, we catch that here
  ::
  ?:  |(=(count 4) (gth count (lent input-tape)))
    ip-set
  :: Divide the tape in to a head & tail, based on current split count
  ::
  =/  head  (scag count input-tape)
  =/  tail  (slag count input-tape)
  :: Check if the head is a valid octet, and weld it to our existing tape
  ::
  ?:  (is-octet head)
    =/  updated-ip  (weld found-ip ?:((lth found-octets 3) (snoc head '.') head))
    :: tisdot was the missing ingredient to get recursion on the remaining tape, and ensure all possible combinations are sought. 
    ::
    :: We're updating the value of the ip-set with the return value of an additional call to this do-tape arm; with the counter is reset, along with our updated-ip tape, which contains the new valid octet, and the current tail as our new input tape
    ::
    =.  ip-set  
      $(input-tape tail, found-ip updated-ip, count 1, found-octets +(found-octets), ip-set ip-set)
    :: This new subject is then fed into another, inner recursive loop, with the count incremented until we either find a new octet or exhaust the string
    ::
    $(count +(count))
  :: If we didn't get a match, this is where we also feed back in on the outer loop with the split counter incremented
  ::
  $(count +(count))

:: Takes a tape, and ensures it fulfils requirement for an IPv4 octet
::
++  is-octet
  |=  input=tape
  :: If candidate is only 1 digit, then it's always valid:
  ::
  ?:  =((lent input) 1)
    %.y
  :: If candidate starts with 0, then it must have length 1
  ::
  ?:  &(=((head input) '0') (gth (lent input) 1))
    %.n
  :: Candidate as a number must be =< 255
  ::
  ?:  (gth (rash (crip input) dem) 255)
    %.n
  %.y
  
:: Checks a input tape for illegal chars and length restrictions
::
++  validate-input
  |=  input=tape
  =/  allowed  "1234567890"
  ?&
    :: Ensure input =< 13
    ::
    (lth (lent input) 13)
    :: Ensure all elements are numbers:
    ::
    (levy input |=(a=@ !=((find `(list @t)`~[a] allowed) ~)))
  ==
--
```

##  Unit Tests

Following a principle of test-driven development, the unit tests below allow us to check for expected behavior. To run the tests yourself, follow the instructions in the [Unit Tests](urbit-docs/userspace/apps/guides/unit-tests) section.

```hoon
/+  *test
/=  restore-ip  /gen/restore-ip
|%
::  test for failures
++  test-01
    %-  expect-fail
    |.  (restore-ip 'a')
++  test-02
    %-  expect-fail
    |.  (restore-ip '1234567890123')
++  test-03
    %-  expect-fail
    |.  (restore-ip '111a1111')
++  test-04
    %-  expect-fail
    |.  (restore-ip '111111@1')
++  test-05
    %-  expect-fail
    |.  (restore-ip '11111111111^')
::  tests for success
++  test-06
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~)
    !>  (restore-ip '1')
++  test-07
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~)
    !>  (restore-ip '11')
++  test-08
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~)
    !>  (restore-ip '111')
++  test-09
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~['1.1.1.1'])
    !>  (restore-ip '1111')
++  test-10
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~['1.1.1.11' '1.1.11.1' '1.11.1.1' '11.1.1.1'])
    !>  (restore-ip '11111')
++  test-11
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~['1.1.1.111' '1.1.11.11' '1.1.111.1' '1.11.1.11' '1.11.11.1' '1.111.1.1' '11.1.1.11' '11.1.11.1' '11.11.1.1' '111.1.1.1'])
    !>  (restore-ip '111111')
++  test-12
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~['1.1.11.111' '1.1.111.11' '1.11.1.111' '1.11.11.11' '1.11.111.1' '1.111.1.11' '1.111.11.1' '11.1.1.111' '11.1.11.11' '11.1.111.1' '11.11.1.11' '11.11.11.1' '11.111.1.1' '111.1.1.11' '111.1.11.1' '111.11.1.1'])
    !>  (restore-ip '1111111')
++  test-13
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~['1.1.111.111' '1.11.11.111' '1.11.111.11' '1.111.1.111' '1.111.11.11' '1.111.111.1' '11.1.11.111' '11.1.111.11' '11.11.1.111' '11.11.11.11' '11.11.111.1' '11.111.1.11' '11.111.11.1' '111.1.1.111' '111.1.11.11' '111.1.111.1' '111.11.1.11' '111.11.11.1' '111.111.1.1'])
    !>  (restore-ip '11111111')
++  test-14
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~['1.11.111.111' '1.111.11.111' '1.111.111.11' '11.1.111.111' '11.11.11.111' '11.11.111.11' '11.111.1.111' '11.111.11.11' '11.111.111.1' '111.1.11.111' '111.1.111.11' '111.11.1.111' '111.11.11.11' '111.11.111.1' '111.111.1.11' '111.111.11.1'])
    !>  (restore-ip '111111111')
++  test-15
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~['1.111.111.111' '11.11.111.111' '11.111.11.111' '11.111.111.11' '111.1.111.111' '111.11.11.111' '111.11.111.11' '111.111.1.111' '111.111.11.11' '111.111.111.1'])
    !>  (restore-ip '1111111111')
++  test-16
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~['11.111.111.111' '111.11.111.111' '111.111.11.111' '111.111.111.11'])
    !>  (restore-ip '11111111111')
++  test-17
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~['111.111.111.111'])
    !>  (restore-ip '111111111111')
++  test-18
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~['1.9.99.91' '1.99.9.91' '1.99.99.1' '19.9.9.91' '19.9.99.1' '19.99.9.1' '199.9.9.1'])
    !>  (restore-ip '199991')
++  test-19
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~['1.99.99.91' '19.9.99.91' '19.99.9.91' '19.99.99.1' '199.9.9.91' '199.9.99.1' '199.99.9.1'])
    !>  (restore-ip '1999991')
++  test-20
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~['19.99.99.91' '199.9.99.91' '199.99.9.91' '199.99.99.1'])
    !>  (restore-ip '19999991')
++  test-21
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~['199.99.99.91'])
    !>  (restore-ip '199999991')
++  test-22
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~)
    !>  (restore-ip '1999999991')
++  test-23
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~['9.8.7.6'])
    !>  (restore-ip '9876')
++  test-24
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~['9.8.7.65' '9.8.76.5' '9.87.6.5' '98.7.6.5'])
    !>  (restore-ip '98765')
++  test-25
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~['9.8.76.54' '9.87.6.54' '9.87.65.4' '98.7.6.54' '98.7.65.4' '98.76.5.4'])
    !>  (restore-ip '987654')
++  test-26
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~['9.87.65.43' '98.7.65.43' '98.76.5.43' '98.76.54.3'])
    !>  (restore-ip '9876543')
++  test-27
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~['98.76.54.32'])
    !>  (restore-ip '98765432')
++  test-28
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~)
    !>  (restore-ip '987654321')
++  test-29
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~['1.1.25.61' '1.12.5.61' '1.12.56.1' '1.125.6.1' '11.2.5.61' '11.2.56.1' '11.25.6.1' '112.5.6.1'])
    !>  (restore-ip '112561')
++  test-30
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~['1.12.56.11' '1.125.6.11' '1.125.61.1' '11.2.56.11' '11.25.6.11' '11.25.61.1' '112.5.6.11' '112.5.61.1' '112.56.1.1'])
    !>  (restore-ip '1125611')
++  test-31
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~['1.112.56.111' '11.12.56.111' '11.125.6.111' '11.125.61.11' '111.2.56.111' '111.25.6.111' '111.25.61.11'])
    !>  (restore-ip '111256111')
++  test-32
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~)
    !>  (restore-ip '111256111111')
++  test-33
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~['100.0.0.1'])
    !>  (restore-ip '100001')
++  test-34
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~['100.0.100.1'])
    !>  (restore-ip '10001001')
++  test-35
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~['10.0.100.100' '100.10.0.100' '100.100.10.0'])
    !>  (restore-ip '100100100')
++  test-36
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~['10.10.10.101' '10.101.0.101' '101.0.10.101'])
    !>  (restore-ip '101010101')
++  test-37
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~)
    !>  (restore-ip '1010101010')
++  test-38
  %+  expect-eq
    !>  `(set @t)`(silt `(list @t)`~['0.1.1.111' '0.1.11.11' '0.1.111.1' '0.11.1.11' '0.11.11.1' '0.111.1.1'])
    !>  (restore-ip '011111')
--
```
