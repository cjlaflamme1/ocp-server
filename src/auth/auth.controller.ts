import { Controller, Post, Req, UseGuards, Logger, Body } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('refresh')
  refreshToken(@Body() refresh: { refreshToken: string }) {
    return this.authService.createAccessTokenFromRefreshToken(
      refresh.refreshToken,
    );
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() loginBody: { email: string; password: string },
    @Req() req,
  ) {
    return this.authService.login(req.user);
  }
}
