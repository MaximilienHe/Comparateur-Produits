export default function handler(req, res) {
  res.status(200).json({
    message:
      "Pour récupérer les caractéristiques d'un produit, utilisez /devices/details/[name]",
  })
}
