+++
title = "3. Deploying"
weight = 12
template = "doc.html"
+++

To deploy your gateway on Urbit, you’ll need to create a [glob](https://docs.urbit.org/userspace/apps/reference/dist/glob) containing the bundled frontend code and assets. After that, you can upload your gateway to the NEAR Gateways app for users on Urbit to use and mirror for themselves.

## Creating the frontend glob

First, run `npm run build`.

Now we’ll run the fakeship’s built-in `make-glob` thread to make the glob. In your fakeship’s dojo run:

```
> |merge %work our %base
> |mount %work
```

A “desk” in Urbit is a software package containing all its dependencies. An Urbit app is a desk and, optionally, a frontend glob in cases where the frontend isn’t generated inside the desk.

At this point, you’ve just created the desk %work including essential dependencies from %base. When you `|mount` the %work desk, you’re making it visible to your OS’s filesystem. You can now see the desk in `/zod/work`, but since this is a new desk there won’t be anything interesting in there. (Run `|mount %base` if you want to see the entire Urbit OS kernel.)

In your filesystem, create a new folder in `/zod/work` called something like `/hello-urbit`. You can now copy the contents of your gateway’s `/dist` folder to this `/hello-urbit` folder.

```
> cp -r /path/to/hello-urbit/dist/* /path/to/zod/work/hello-urbit
```

In your fakeship’s dojo, `|commit` your %work desk.

```
> |commit %work
```

Then make the glob, using the `make-glob` thread in the %landscape desk.

```
> -landscape!make-glob %work /hello-urbit
```

You should see something like this in the dojo:

```
[ %globbed
  { /156.38d4ccbba1878fc86446.bundle/js
    /assets/index-390be12d/js
    ...
    /index/html
  }
]
> -landscape!make-glob %work /hello-urbit
0
```

You can now `cd` to `/path/to/zod/.urb/put` where you’ll find a file like `glob-0v5.fdf99.nph65.qecq3.ncpjn.q13mb.glob`. This is your bundled frontend which we’ll upload to NEAR Gateways. Everything between `glob-` and `.glob` is a hash of the file’s content. You won’t need it for the rest of this process, so you could rename the file anything you like.

## Deploying to NEAR Gateways

To deploy your gateway to the NEAR Gateways app, you’ll need to upload the glob to an S3 bucket or some other publicly-available endpoint.

{% callout %}

If you get a Red Horizon ship at [this link](https://redhorizon.com/join/61c3b5a7-9eba-437c-8049-b5b217625bcf), you’ll have an Urbit app called Silo pre-loaded. To get S3 working with this app, you’ll need to click “Set S3 credentials” in your Red Horizon dashboard. This will set up S3 bucket for your whole ship; Silo will detect when this changes and configure to the new bucket. When that’s all working, upload your glob to any folder and click to chain icon to grab the link. (The correct link should end in `.glob`.)

{% /callout %}

Once your glob is uploaded, open the NEAR Gateways app on your live ship and fill out the form with your gateway’s details:
- Your gateway’s title
- The URL for your uploaded glob
- The URL for a thumbnail preview image (optional, but encouraged)
- A brief description of your gateway

Click “Publish Gateway” and wait for your gateway to upload. This could take some time, but you don’t have to keep the window open while you wait; your ship is processing the glob in the background.

## Sharing your gateway

The NEAR Gateways app gossips your gateways among your pals. What does that mean?

Urbit’s third-party Pals app serves as one friends list which any app can interact with. Several popular Urbit apps leverage a pals-based gossip mechanism to pass information around, most often to the people in your friends list and the people in their friends list.

The NEAR Gateways app uses this to distribute gateways without the need for a centralized repository. We hard-coded a subscription to ~bitdeg’s gateways in there, but ~bitdeg won’t relay other ships’ gateways to you. Your Red Horizon ship comes pre-configured with one pal, ~palweb-dozzod-doldys, a ship run by Red Horizon which accepts all friend requests that come in.

As soon as you upload your gateway, it’ll be sent to ~palweb-dozzod-doldys. If that ship has NEAR Gateways installed it’ll pass your gateway along to its first-degree pals.

If you want to tell us about your gateway or find some more NEAR devs on Urbit, you can join our NEAR group by searching “~bitdeg” in the Tlon app’s Discovery page. If you’re using one of our Red Horizon ships, you’re already in this group as well as a selection of others. See you on the network!
