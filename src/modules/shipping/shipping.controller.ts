import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ShippingService } from './shipping.service';

@ApiTags('Shipping')
@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get('countries')
  @ApiOperation({
    summary: 'Get all shipping countries',
    description: 'Retrieve a list of all countries available for shipping.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of shipping countries',
    schema: {
      type: 'object',
      properties: {
        countries: {
          type: 'array',
          items: { type: 'string' },
          example: ['NG', 'GB', 'US', 'DE', 'FR'],
        },
      },
    },
  })
  getShippingCountries(): { countries: string[] } {
    return { countries: this.shippingService.getShippingCountries() };
  }

  @Get('zones/:country')
  @ApiOperation({
    summary: 'Get shipping zones for a country',
    description: 'Retrieve shipping zones and options for a specific country.',
  })
  @ApiResponse({
    status: 200,
    description: 'Shipping zones and options retrieved successfully',
  })
  getShippingZones(@Param('country') country: string) {
    return this.shippingService.getShippingZones(country);
  }
}
