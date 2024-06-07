# dSand
## A falling sand game, on the browser
dSand is a falling sand game, that I'm making as a simple supplementary personal project to my web-dev self-study. It'll function ideally as a falling sand game, with extra elements not typically seen in other sand games that often, such as advanced physics, player movement, etc. I want to make my own sand game with my own art direction, so I can play my very own ideal sand game! If you like it as well, then that's just fantastic.

This is an amateur project, and in no way is trying to be the 'best' falling sand sim. The code may be ugly, and it might be buggy, however, my end goal is making a sand sim that achieves what I want to see in a sand sim.

## Goals
This is not exactly a roadmap, however some key features I intend on implementing are:
- Gravity, velocity
- Particle physics, particles can get flung into the air, etc
- Player character object, for obbies and whatnot
- Possible level sharing system thru a web server
- Highly complex emergent behaviour
- Good art direction (colors, UI, behaviour)

## Todo
### Optimize, optimize, optimize
- Chunks
- Multi-threading?
- Optimize particle structure, particle behaviours
### UI
- Pen size chooser
- Current selected element label
- Clear grid button
- Element categories in particle picker

## Contribution
### Live server
In order to get started, simply serve index.html from a live server, in order to not get ECMAscript modules blocked by the CORS policy.

Personally, I use the `live-server` npm package. In order to get that setup, simply run:
`npm install`
and to use it, run:
`npx live-server`

### Pull requests
I'm a git noob, so help me merge your pull request. If your contribution is particularly great, I may just pull it to the repo.
