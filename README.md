# 📺 YouTube Downloader

<div align="center">

![YouTube Downloader](https://img.shields.io/badge/YouTube-Downloader-red?style=for-the-badge&logo=youtube)
[![Made with Nuxt](https://img.shields.io/badge/Made%20with-Nuxt.js-00DC82?style=for-the-badge&logo=nuxt.js)](https://nuxt.com/)
[![Made with Vue.js](https://img.shields.io/badge/Made%20with-Vue.js-4FC08D?style=for-the-badge&logo=vue.js)](https://vuejs.org/)
[![GitHub license](https://img.shields.io/github/license/Reptilz/youtube-downloader?style=for-the-badge)](https://github.com/Reptilz/youtube-downloader/blob/main/LICENSE)

Une application web moderne pour télécharger vos vidéos YouTube préférées dans différents formats de qualité. 🚀

[Demo](https://youtube-downloader.vercel.app) · [Signaler un Bug](https://github.com/Reptilz/youtube-downloader/issues) · [Suggérer une Fonctionnalité](https://github.com/Reptilz/youtube-downloader/issues)

</div>

## ✨ Fonctionnalités

- 🎥 Téléchargement de vidéos YouTube en haute qualité
- 📊 Sélection flexible des formats vidéo
- 🎯 Interface utilisateur intuitive et réactive
- 💫 Design moderne avec animations fluides
- ⚡ Performance optimale avec Nuxt 3
- 🔒 Sécurisé et fiable
- 📱 Responsive design (mobile-first)

## 🛠️ Technologies Utilisées

<div align="center">

[![Nuxt][Nuxt.js]][Nuxt-url] [![Vue][Vue.js]][Vue-url] [![Tailwind][Tailwind-CSS]][Tailwind-url] [![TypeScript][TypeScript]][TypeScript-url]

</div>

- 🟢 **[Nuxt 3](https://nuxt.com/)** - Framework Vue.js moderne
- 🎨 **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitaire
- 📥 **[play-dl](https://github.com/play-dl/play-dl)** - Bibliothèque de téléchargement YouTube
- 📝 **TypeScript** - Typage statique pour JavaScript

## 🚀 Installation

1️⃣ **Clonez le dépôt :**
```bash
git clone https://github.com/Reptilz/youtube-downloader.git
cd youtube-downloader
```

2️⃣ **Installez les dépendances :**
```bash
npm install
```

3️⃣ **Démarrez le serveur de développement :**
```bash
npm run dev
```

🌐 L'application sera accessible à l'adresse `http://localhost:3000`

## ⚙️ Configuration

1️⃣ **Créez un fichier `.env` à la racine du projet :**
```env
YOUTUBE_API_KEY=votre_clé_api_youtube
```

2️⃣ **Obtenez une clé API YouTube :**
   - 🔑 Allez sur [Google Cloud Console](https://console.cloud.google.com/)
   - 📁 Créez un nouveau projet
   - ✅ Activez l'API YouTube Data
   - 🔐 Créez des identifiants (clé API)
   - 📋 Copiez la clé dans votre fichier `.env`

## 📖 Utilisation

1. 📋 Collez l'URL d'une vidéo YouTube
2. 🔄 Cliquez sur "Charger"
3. 🎯 Sélectionnez la qualité souhaitée
4. ⬇️ Cliquez sur "Télécharger"

## 🌍 Déploiement

```bash
# 🏗️ Construire l'application
npm run build

# 🚀 Démarrer en mode production
npm run start
```

## 📄 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

<div align="center">
  <a href="https://github.com/Reptilz">
    <img src="https://github.com/Reptilz.png" width="100px;" alt="Jordan Morlet"/>
    <br />
    <sub><b>Jordan Morlet</b></sub>
  </a>
</div>

## 🤝 Contribution

Les contributions sont les bienvenues ! Suivez ces étapes :

1. 🍴 Fork le projet
2. 🔨 Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. 💾 Commitez vos changements (`git commit -m 'Add: Amazing Feature'`)
4. 📤 Push sur la branche (`git push origin feature/AmazingFeature`)
5. 📫 Ouvrez une Pull Request

## ⭐ Support

Si vous aimez ce projet, donnez-lui une ⭐️ !

<div align="center">

[![Star History Chart](https://api.star-history.com/svg?repos=Reptilz/youtube-downloader&type=Date)](https://star-history.com/#Reptilz/youtube-downloader&Date)

</div>

<!-- MARKDOWN LINKS & IMAGES -->
[Nuxt.js]: https://img.shields.io/badge/Nuxt-002E3B?style=for-the-badge&logo=nuxtdotjs&logoColor=#00DC82
[Nuxt-url]: https://nuxt.com/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Tailwind-CSS]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
