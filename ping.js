const axios = require('axios');
const fs = require('fs');

async function pingXMLRPC(siteName, siteUrl, postUrl) {
  // Payload XML-RPC
  const xmlrpc = `<?xml version="1.0"?>
<methodCall>
<methodName>weblogUpdates.extendedPing</methodName>
<params>
<param>
<value>${siteName}</value>
</param>
<param>
<value>${siteUrl}</value>
</param>
<param>
<value>${postUrl}</value>
</param>
</params>
</methodCall>`;

  // List URL server XML-RPC
  const pingServices = fs.readFileSync('pingservices.txt', 'utf8').split('\n');

  // Loop melalui setiap server XML-RPC
  for (const pingService of pingServices) {
    if (pingService.trim() !== "") {
      try {
        // Kirim request ping ke layanan ping service
        const pingResponse = await axios.get(`${pingService.trim()}ping?url=${encodeURIComponent(postUrl)}`);

        // Tampilkan response dari layanan ping service
        console.log(`Ping ${postUrl} via ${pingService}: ${pingResponse.data}`);
      } catch (error) {
        console.error(`Error saat melakukan ping ke ${postUrl} via ${pingService}: ${error.message}`);
      }
    }
  }
}

// Ambil listurl.txt dari server
axios.get('https://blogkeren.web.id/listurl.txt')
  .then(response => {
    const data = response.data;
    const lines = data.split('\n');

    for (const line of lines) {
      const [siteName, siteUrl, postUrl] = line.split(';');
      if (siteName && siteUrl && postUrl) {
        pingXMLRPC(siteName, siteUrl, postUrl);
      }
    }
  })
  .catch(error => {
    console.error('Error saat mengambil listurl.txt:', error);
  });
