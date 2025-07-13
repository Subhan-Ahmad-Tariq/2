declare module 'express-async-handler' {
    import { Request, Response, NextFunction } from 'express';
  
    function expressAsyncHandler<T = any>(
      handler: (req: Request, res: Response, next: NextFunction) => Promise<T>
    ): (req: Request, res: Response, next: NextFunction) => void;
  
    export = expressAsyncHandler;
  }
  