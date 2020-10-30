# Ball Dodge 

Goal: make my Ball Dodge project look cool using react

Purpose of this document: to track the intended changes and take notes 
on encountered problems. It's only really useful during the actual process
of adding to and refactoring the projet.

finish by: oct 1

## Tasks/commits

- [x] refactor physics
- [x] set up project for react
- [ ] change canvas display into react component
- [ ] document 2d physics because its funny
- [ ] make game fill available display
- [ ] change game mechanics (no zones, balls appear randomly)
- [ ] add overlay components (score, fps, lose-display)
- [ ] add intro page component (instructions, etc.)
- [ ] change favicon


## Work log

### September 13, 2020
refactor physics.  
time spend: 1h30m

## Notes

### destructuring with custom names
`let { pos: pos1, speed: speed1 } = ball1;` where the new variables are `pos1`
and `speed1`

### merge commit
if you merge a branch into master and all that was needed for the merge was a
fast forward there wont be a merge commit. It will look as if the changes were
committed to master