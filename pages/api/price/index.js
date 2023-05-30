export default function handler(req, res) {
  res.status(200).json({
    message:
      "Pour récupérer l'historique de prix d'un produit, utilisez le endpoint /price/[device_id]",
  })
}
