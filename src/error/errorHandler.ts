import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(error)
  }

  if (error instanceof z.ZodError) {
    res
      .status(400)
      .send({ error: 'Validations error', message: error.errors[0].message })
  } else {
    res.status(500).send({ error: 'Internal server error!' })
  }
}
