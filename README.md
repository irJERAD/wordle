# Wordle

A small browser word game for middle school students.

## Run it

Open `/Users/irjerad/Documents/Wordl/index.html` in a browser.

## Deploy To Netlify

This project is already set up as a static site for Netlify.

1. Open a terminal in `/Users/irjerad/Documents/Wordl`
2. Deploy to the existing Netlify site:

```bash
npx -p node@20 -p @netlify/mcp@latest netlify-mcp --site-id 9da5b90a-d48b-494f-b62c-825770b1c90f --proxy-path "https://netlify-mcp.netlify.app/proxy/eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..uTOjrBDBrbivC26y.wT7jct6lglGYAjCELRT8mcB4FYW0IWlP8SuE_npb3AAKRc2nbSGFMypcM2w4prGbWg_YpKKkFOCA55TisRn6zLYHKxWDmHNWU0aRUrMyYLyN5mux18mrYR6ICGRKYkquDhw6K9Lwb4utHXy4Nx2qWE4k96Ge7IX3-ZtGTCnW22b2sF8sHnfrKri-1m7YZAMaWxmXfMzVqiU3DJrlOUeD3GqCraZkXmIVbSQbJGhg54-M-tbeXIzrU0DdV1PkAaqj6Zt3LrbS8NqK3iikSLWpGcwrekEALnJ4xvaFeB6DOqAcDwTZzjdKDXxinfcb4v989IZOOcR46HZTEmDoqeymIUcDbH5lEfbk2o20Nxznkp9o2UXJTA.7-y6O3JwddALjk_jYkTPdw"
```

3. Open the Netlify project dashboard:

[wordle-jerad project](https://app.netlify.com/projects/wordle-jerad)

4. Add the custom domain `wordle.jerad.xyz`
5. In your DNS provider, point `wordle.jerad.xyz` to Netlify using the DNS records Netlify shows for that domain

After the deploy finishes, the default site URL should be:

[wordle-jerad.netlify.app](https://wordle-jerad.netlify.app)

## What it includes

- A five-letter guessing game with six tries
- Dictionary-backed guess checking for real five-letter words
- Themed word sets like science, history, ELA, and nature
- A bright classroom-friendly layout that works on desktop and mobile
- Local win tracking using browser storage

## Next ideas

- Pull words from weekly vocabulary lists
- Track streaks by student name
- Add difficulty levels or themed word sets
