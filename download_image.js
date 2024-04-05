const axios = require('axios')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const downloadImage = async (url, imagePath) => {
    try {
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
      });
  
      // Vérification du code de réponse HTTP pour s'assurer qu'il indique un succès
      if (response.status === 200) {
        return new Promise((resolve, reject) => {
          response.data
            .pipe(fs.createWriteStream(imagePath))
            .on('finish', () => resolve())
            .on('error', (e) => reject(e));
        });
      } else {
        // Log en cas de réponse non réussie
        console.error(`Failed to download the image: ${url}. Server responded with status: ${response.status}`);
      }
    } catch (error) {
      // Log en cas d'erreur réseau ou autre
      console.error(`Error downloading the image: ${url}. Error: ${error}`);
    }
  };
  

const randomDelay = () => {
  // Generate a random delay between 500ms and 2000ms
  return Math.floor(Math.random() * (2000 - 500 + 1) + 500)
}

const downloadImages = async () => {
  try {
    // const {data} = await axios.get('https://comparateur.droidsoft.fr/api/devices?limit=50000');
    // Get with x-api-key from env (API_KEY_SECRET)
    const { data } = await axios.get(
      'https://comparateur.droidsoft.fr/api/devices?limit=50000',
      {
        headers: {
          'x-api-key': process.env.API_KEY_SECRET,
        },
      },
    )

    console.log('DATA : ', data)

    console.log(`Fetched ${data.length} devices`)

    for (let i = 0; i < data.length; i++) {
      const device = data[i]
      const imageUrl = device.img
      const imageName = path.basename(imageUrl)
      const imagePath = path.resolve(__dirname, './public/Images', imageName)

      if (!fs.existsSync(imagePath)) {
        await downloadImage(imageUrl, imagePath)
        console.log(`Downloaded ${imageName}`)
      // Wait for a random time between downloads to avoid being blocked
        await new Promise((resolve) => setTimeout(resolve, randomDelay()))
      } else {
        console.log(`Image ${imageName} already exists, skipping...`)
      }

    }
  } catch (error) {
    console.error('Error fetching the devices: ', error)
  }
}

downloadImages()
