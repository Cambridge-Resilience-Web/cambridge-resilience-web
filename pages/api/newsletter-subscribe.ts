import client from '@mailchimp/mailchimp_marketing'

export default async (req, res) => {
  const { email } = req.body

  if (!email || !email.length) {
    return res.status(400).json({
      error: 'Forgot to add your email',
    })
  }

  client.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: 'us13',
  })

  try {
    const response = await client.lists.addListMember(
      process.env.MAILCHIMP_LIST_ID,
      {
        email_address: email,
        status: 'subscribed',
      },
    )

    console.log(response)

    return res.status(201).json({ error: null })
  } catch (error) {
    console.error(`[RW] Failed to sign up user to newsletter - ${error}`)
    return res.status(400).json({
      error:
        'Oops, something went wrong. Please send an email to cambridgeresilienceweb@gmail.com and we can add you to the list.',
    })
  }
}
