|%
+$  id  @
+$  name  @t
+$  task  [=name done=?]
+$  tasks  (map id task)
+$  who  @p
+$  friends  (set who)
+$  action
  $%  [%add =name]
      [%del =id]
      [%toggle =id]
      [%rename =id =name]
      [%allow =who]
      [%kick =who]
  ==
+$  update
  $%  [%add =id =name]
      [%del =id]
      [%toggle =id]
      [%rename =id =name]
      [%initial =tasks]
  ==
--
