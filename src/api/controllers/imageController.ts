import { Request, Response, NextFunction } from 'express';

const imagePost = async (
  req: Request<{}, {}, { text: string }>,
  res: Response<{ imageUrl: string }>,
  next: NextFunction
) => {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_KEY_URL}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: req.body.text,
        n: 1,
        size: '1024x1024'
      })
    };

    const response = await fetch(
      process.env.OPENAI_API_URL + '/v1/images/generations',
      options
    );
    console.log('API response:', response);

    const data = await response.json();
    console.log('Data:', data);
    
    if (data && data.data && data.data.length > 0) {
      const imageUrl = data.data[0].url;
      res.json({ imageUrl });
    } else {
      res.status(500).json({ imageUrl: '' });
    }

  } catch (error) {
    next(error);
  }
};

export { imagePost };