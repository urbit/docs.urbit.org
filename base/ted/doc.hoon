/-  spider
/+  test, strandio, *ph-io
::
^-  thread:spider
|=  arg=vase
=/  m  (strand:rand ,vase)
;<  ~  bind:m  start-simple
;<  ~  bind:m  (init-ship ~zod &)
;<  ~  bind:m  (dojo ~zod "(add 2 3)")
;<  ~  bind:m  (wait-for-output ~zod "5")
;<  ~  bind:m  end
(pure:m *vase)
