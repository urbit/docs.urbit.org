+++
title = "Docs guide"
name = "docs-guide"
+++

## FAQ Component

{% markdocExample %}
````md
{% faq %}

## Optional title

And optional paragraph, or whatever. All the usual markdoc stuff works...

{% faqSection question="Question 1?" %}
Answer to question 1.
{% /faqSection %}

{% faqSection question="Question 2?" %}
Answer to question 2.
{% /faqSection %}

.
.
.

{% /faq %}
````
{% /markdocExample %}

### Example

#### Markdown

{% markdocExample %}
````md
{% faq %}

## FAQ

{% faqSection question="How do I write a proposal?" %}
Proposals should clearly articulate your idea and the value it
will bring to the Urbit network.

Good proposals all include the following:


— A detailed and clear description of the proposal. If you're
proposing something technical, user stories are a good idea.

— An overview of why you are the right person for the job. A
description of your background, familiarity with the project, and
professional/education experience are all good starts.

— Your estimate for date of completion.

— The amount of funding you'd like for the project, denominated in
stars. What specific deliverables will look like.


It’s recommended to break your project into milestones, each of
which must have its own completion dates, funding amounts and
deliverables. In general, proposals should target a first
deliverable within two months of the start of the project.
Proposals should have a maximum of five milestones as scoping a
project beyond that is impractical, and each milestone should
constitute significant enough work to warrant the reward of a full
star.
{% /faqSection %}

{% faqSection question="Question 2?" %}
Answer to question 2.
{% /faqSection %}

{% faqSection question="Question 3?" %}
Answer to question 3.
{% /faqSection %}

{% faqSection question="Question 4?" %}
Answer to question 4.
{% /faqSection %}

{% /faq %}
````
{% /markdocExample %}

#### Result

{% faq %}

## FAQ

{% faqSection question="How do I write a proposal?" %}
Proposals should clearly articulate your idea and the value it
will bring to the Urbit network.

Good proposals all include the following:


— A detailed and clear description of the proposal. If you're
proposing something technical, user stories are a good idea.

— An overview of why you are the right person for the job. A
description of your background, familiarity with the project, and
professional/education experience are all good starts.

— Your estimate for date of completion.

— The amount of funding you'd like for the project, denominated in
stars. What specific deliverables will look like.


It’s recommended to break your project into milestones, each of
which must have its own completion dates, funding amounts and
deliverables. In general, proposals should target a first
deliverable within two months of the start of the project.
Proposals should have a maximum of five milestones as scoping a
project beyond that is impractical, and each milestone should
constitute significant enough work to warrant the reward of a full
star.
{% /faqSection %}

{% faqSection question="Question 2?" %}
Answer to question 2.
{% /faqSection %}

{% faqSection question="Question 3?" %}
Answer to question 3.
{% /faqSection %}

{% faqSection question="Question 4?" %}
Answer to question 4.
{% /faqSection %}

{% /faq %}

## Button

{% markdocExample %}
````md
{% button label="Click me" link="https://example.com" /%}

{% button className="btn-dark" label="Click me" link="https://example.com" /%}
````
{% /markdocExample %}

#### Markdown

{% markdocExample %}
````md
This is a {% button label="Button" link="http://www.google.com" /%} and an {% button className="btn-dark" label="Other" link="http://www.google.com" /%}.
````
{% /markdocExample %}

#### Result

This is a {% button label="Button" link="http://www.google.com" /%} and an {% button className="btn-dark" label="Other" link="http://www.google.com" /%}.

## Code Block

{% markdocExample %}

````md
```language {% copy=true/false fullscreen=true/false mode="full"/"collapse" %}
Code block content here...
```
````

{% /markdocExample %}

### Example

#### Markdown

{% markdocExample %}

````md
```hoon {% copy=true fullscreen=true mode="collapse" %}
Hoon code...
```
````

{% /markdocExample %}

#### Result

```hoon {% copy=true fullscreen=true mode="collapse" %}
::
::  A library for producing Rhonda numbers and testing if numbers are Rhonda.
::
::    A number is Rhonda if the product of its digits of in base b equals 
::    the product of the base b and the sum of its prime factors.
::    see also: https://mathworld.wolfram.com/RhondaNumber.html
::
=<
::
|%
::  +check: test whether the number n is Rhonda to base b
::
++  check
  |=  [b=@ud n=@ud]
  ^-  ?
  ~_  leaf+"base b must be >= 2"
  ?>  (gte b 2)
  ~_  leaf+"candidate number n must be >= 2"
  ?>  (gte n 2)
  ::
  .=  (roll (base-digits b n) mul)
  %+  mul
    b
  (roll (prime-factors n) add)
::  +series: produce the first n numbers which are Rhonda in base b
::
::    produce ~ if base b has no Rhonda numbers
::
++  series
  |=  [b=@ud n=@ud]
  ^-  (list @ud)
  ~_  leaf+"base b must be >= 2"
  ?>  (gte b 2)
  ::
  ?:  =((prime-factors b) ~[b])
    ~
  =/  candidate=@ud  2
  =+  rhondas=*(list @ud)
  |-
  ?:  =(n 0)
    (flop rhondas)
  =/  is-rhonda=?  (check b candidate)
  %=  $
    rhondas    ?:(is-rhonda [candidate rhondas] rhondas)
    n          ?:(is-rhonda (dec n) n)
    candidate  +(candidate)
  ==
--
::
|%
::  +base-digits: produce a list of the digits of n represented in base b
::
::    This arm has two behaviors which may be at first surprising, but do not
::    matter for the purposes of the ++check and ++series arms, and allow for
::    some simplifications to its implementation.
::    - crashes on n=0
::    - orders the list of digits with least significant digits first
::
::    ex: (base-digits 4 10.206) produces ~[2 3 1 3 3 1 2]
::
++  base-digits
  |=  [b=@ud n=@ud]
  ^-  (list @ud)
  ?>  (gte b 2)
  ?<  =(n 0)
  ::
  |-
  ?:  =(n 0)
    ~
  :-  (mod n b)
  $(n (div n b))
::  +prime-factors: produce a list of the prime factors of n
::
::    by trial division
::    n must be >= 2
::    if n is prime, produce ~[n]
::    ex: (prime-factors 10.206) produces ~[7 3 3 3 3 3 3 2]
::
++  prime-factors
  |=  [n=@ud]
  ^-  (list @ud)
  ?>  (gte n 2)
  ::
  =+  factors=*(list @ud)
  =/  wheel  new-wheel
  ::  test candidates as produced by the wheel, not exceeding sqrt(n) 
  ::
  |-
  =^  candidate  wheel  (next:wheel)
  ?.  (lte (mul candidate candidate) n)
    ?:((gth n 1) [n factors] factors)
  |-
  ?:  =((mod n candidate) 0)
    ::  repeat the prime factor as many times as possible
    ::
    $(factors [candidate factors], n (div n candidate))
  ^$
::  +new-wheel: a door for generating numbers that may be prime
::
::    This uses wheel factorization with a basis of {2, 3, 5} to limit the
::    number of composites produced. It produces numbers in increasing order
::    starting from 2.
::
++  new-wheel
  =/  fixed=(list @ud)  ~[2 3 5 7]
  =/  skips=(list @ud)  ~[4 2 4 2 4 6 2 6]
  =/  lent-fixed=@ud  (lent fixed)
  =/  lent-skips=@ud  (lent skips)
  ::
  |_  [current=@ud fixed-i=@ud skips-i=@ud]
  ::  +next: produce the next number and the new wheel state
  ::
  ++  next
    |.
    ::  Exhaust the numbers in fixed. Then calculate successive values by
    ::  cycling through skips and increasing from the previous number by
    ::  the current skip-value.
    ::
    =/  fixed-done=?  =(fixed-i lent-fixed)
    =/  next-fixed-i  ?:(fixed-done fixed-i +(fixed-i))
    =/  next-skips-i  ?:(fixed-done (mod +(skips-i) lent-skips) skips-i)
    =/  next
    ?.  fixed-done
      (snag fixed-i fixed)
    (add current (snag skips-i skips))
    :-  next
    +.$(current next, fixed-i next-fixed-i, skips-i next-skips-i)
  --
--
```

## Link

### Example

#### Markdown

```md
Agents are managed by the [Gall](/glossary/gall) [vane](/glossary/vane)
```

#### Result
Agents are managed by the [Gall](/glossary/gall) [vane](/glossary/vane)

## Tooltip

### Example

#### Markdown

{% markdocExample %}

```md
`=>` {% tooltip label="tisgar"
href="/language/hoon/reference/rune/tis#-tisgar" /%} composes two
expressions so that the first is included in the second's {% tooltip
label="subject" href="/glossary/subject" /%} (and thus can see it).
```

{% /markdocExample %}


#### Result

`=>` {% tooltip label="tisgar"
href="/language/hoon/reference/rune/tis#-tisgar" /%} composes two
expressions so that the first is included in the second's {% tooltip
label="subject" href="/glossary/subject" /%} (and thus can see it).

## Icon Card

### Example - Normal

#### Markdown

{% markdocExample %}

```md
{% grid %}

  {% iconcard
    title="Arvo"
    description="Arvo is the kernel itself."
    label="View Section"
    href="/system/kernel/arvo"
    icon="Arvo"
  /%}

  ...

{% /grid %}
```

{% /markdocExample %}


#### Result

{% grid %}

  {% iconcard
    title="Arvo"
    description="Arvo is the kernel itself."
    label="View Section"
    href="/system/kernel/arvo"
    icon="Arvo"
  /%}

  {% iconcard
    title="Ames"
    description="Ames is the name of our network and the vane that communicates over it. It's an encrypted P2P network composed of instances of the Arvo operating system."
    label="View Section"
    href="/system/kernel/ames"
    icon="Ames"
  /%}

  {% iconcard
    title="Behn"
    description="Behn is our timer. It allows vanes and applications to set and timer events, which are managed in a simple priority queue."
    label="View Section"
    href="/system/kernel/behn"
    icon="Behn"
  /%}

  {% iconcard
    title="Clay"
    description="Clay is our filesystem and revision-control system."
    label="View Section"
    href="/system/kernel/clay"
    icon="Clay"
  /%}

{% /grid %}

### Example - Small

#### Markdown

{% markdocExample %}

```md
{% grid %}

  {% iconcard
    title="Arvo"
    description="Arvo is the kernel itself."
    label="View Section"
    href="/system/kernel/arvo"
    icon="Arvo"
    small=true
  /%}

  ...

{% /grid %}
```

{% /markdocExample %}


#### Result

{% grid %}

  {% iconcard
    title="Arvo"
    description="Arvo is the kernel itself."
    label="View Section"
    href="/system/kernel/arvo"
    icon="Arvo"
    small=true
  /%}

  {% iconcard
    title="Ames"
    description="Ames is the name of our network and the vane that communicates over it. It's an encrypted P2P network composed of instances of the Arvo operating system."
    label="View Section"
    href="/system/kernel/ames"
    icon="Ames"
    small=true
  /%}

  {% iconcard
    title="Behn"
    description="Behn is our timer. It allows vanes and applications to set and timer events, which are managed in a simple priority queue."
    label="View Section"
    href="/system/kernel/behn"
    icon="Behn"
    small=true
  /%}

  {% iconcard
    title="Clay"
    description="Clay is our filesystem and revision-control system."
    label="View Section"
    href="/system/kernel/clay"
    icon="Clay"
    small=true
  /%}

{% /grid %}

## Video

### Example

#### Markdown

{% markdocExample %}

```md
{% video src="https://media.urbit.org/docs/hoon-school-videos/HS110 - Syntax.mp4" /%}
```

{% /markdocExample %}


#### Result

{% video src="https://media.urbit.org/docs/hoon-school-videos/HS110 - Syntax.mp4" /%}
