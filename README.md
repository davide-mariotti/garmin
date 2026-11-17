<p align="center">
  <img src="https://davide-mariotti.github.io/favicon.svg" width="96" alt="dm. logo">
</p>

<h1 align="center">Garmin</h1>

<p align="center">
  A private training dashboard: runs, strength, plan and analysis, from Garmin Connect.<br>
  <a href="#english">English</a> · <a href="#italiano">Italiano</a> · <a href="https://davide-mariotti.github.io/garmin/">Open (sign-in required)</a>
</p>

<p align="center">
  <a href="https://ko-fi.com/Z0X32ATNHL"><img src="https://ko-fi.com/img/githubbutton_sm.svg" alt="Buy me a coffee on Ko-fi"></a>
</p>

---

## English

### What it does

- Every morning a GitHub Action downloads each athlete's Garmin data and publishes it on Firestore, full history included.
- The pages (dashboard, plan, strength, analysis, wiki) read that data after a Google sign-in.
- The training plan is checked against its own rules by `check-plan.js` before it changes.

### What it doesn't do

- It doesn't put health data in this repo: data, keys and personal notes stay out of git (see `.gitignore`).
- It isn't open to everyone: without an authorised account the pages show nothing.
- It isn't a Garmin product and isn't endorsed by Garmin.

### How it works

- `fetch.py` downloads from Garmin Connect, `publish.py` writes to Firestore (`--pull` first takes back what's already online, so each run only fetches what's new).
- `.github/workflows/garmin.yml` runs it daily at 04:30 UTC. Secrets: `GARMIN_KEY_<NAME_SURNAME>` for each athlete and `FIREBASE_SERVICE_ACCOUNT`.
- The repo is published by GitHub Pages at `/garmin/`; `_config.yml` keeps scripts and notes out of the site.

### Support

If the idea helped you build your own, you can [buy me a coffee on Ko-fi](https://ko-fi.com/Z0X32ATNHL).

### License

The code is [MIT](LICENSE). The data is not in here, and it stays that way.

---

## Italiano

### Cosa fa

- Ogni mattina una GitHub Action scarica i dati Garmin di ogni atleta e li pubblica su Firestore, con tutta la storia.
- Le pagine (dashboard, piano, forza, analisi, wiki) leggono quei dati dopo l'accesso con Google.
- Il piano di allenamento viene controllato con le sue regole da `check-plan.js` prima di cambiarlo.

### Cosa non fa

- Non mette dati sanitari in questa repo: dati, chiavi e note personali restano fuori da git (vedi `.gitignore`).
- Non è aperta a tutti: senza un account autorizzato le pagine non mostrano niente.
- Non è un prodotto Garmin e Garmin non c'entra.

### Come funziona

- `fetch.py` scarica da Garmin Connect, `publish.py` scrive su Firestore (`--pull` prima riprende quello che è già online, così ogni giro scarica solo le novità).
- `.github/workflows/garmin.yml` lo lancia ogni giorno alle 04:30 UTC. Secret: `GARMIN_KEY_<NOME_COGNOME>` per ogni atleta e `FIREBASE_SERVICE_ACCOUNT`.
- La repo è pubblicata da GitHub Pages su `/garmin/`; `_config.yml` tiene script e note fuori dal sito.

### Supporto

Se l'idea ti è servita per farti la tua, puoi [offrirmi un caffè su Ko-fi](https://ko-fi.com/Z0X32ATNHL).

### Licenza

Il codice è [MIT](LICENSE). I dati qui non ci sono, e non ci saranno.
