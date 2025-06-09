import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

interface ShippingMethod {
  name: string;
  currency: string;
  cost: number;
  description?: string;
  estimatedDelivery: string;
}

interface ShippingZone {
  name: string;
  description: string;
  currency: string;
  countries: string[];
  states?: string[];
  method: ShippingMethod;
}

interface ShippingConfig {
  zones: Record<string, ShippingZone>;
  fallback: {
    zone: string;
    message: string;
  };
}

export interface ShippingCalculation {
  zone: string;
  zoneName: string;
  states?: string[];
  shippingMethod: ShippingMethod;
}

export interface ShippingZonesResponse {
  country: string;
  zones: ShippingCalculation[];
}

@Injectable()
export class ShippingService {
  private shippingConfig: ShippingConfig;

  constructor() {
    this.loadShippingConfig();
  }

  private loadShippingConfig(): void {
    try {
      const configPath = join(
        process.cwd(),
        'src/modules/shipping/json/shipping-rates.json',
      );
      const configFile = readFileSync(configPath, 'utf-8');
      this.shippingConfig = JSON.parse(configFile) as ShippingConfig;
    } catch (error) {
      console.error('Failed to load shipping configuration:', error);
      throw new Error('Shipping configuration not found');
    }
  }

  calculateShipping(country: string): ShippingCalculation {
    // this checks the json file and returns the shipping zones based on the country
    const zoneKey = this.determineShippingZone(country);

    const zoneConfig = this.shippingConfig.zones[zoneKey];

    if (!zoneConfig) {
      const fallbackZone = this.shippingConfig.fallback.zone;
      const fallbackConfig = this.shippingConfig.zones[fallbackZone];
      return {
        zone: fallbackZone,
        zoneName: fallbackConfig.name,
        shippingMethod: {
          cost: fallbackConfig.method.cost,
          name: fallbackConfig.method.name,
          currency: fallbackConfig.method.currency,
          estimatedDelivery: fallbackConfig.method.estimatedDelivery,
        },
      };
    }
    return {
      zone: zoneKey,
      zoneName: zoneConfig.name,
      shippingMethod: {
        cost: zoneConfig.method.cost,
        name: zoneConfig.method.name,
        currency: zoneConfig.method.currency,
        estimatedDelivery: zoneConfig.method.estimatedDelivery,
      },
    };
  }

  getShippingZones(country: string): ShippingZonesResponse {
    // ensures the country code sent is in upper case
    const countryCode = country.toUpperCase();
    const zones: ShippingCalculation[] = [];

    if (countryCode === 'NG') {
      // return both lagos and outside lagos zones
      const lagosZone = this.shippingConfig.zones['within_lagos'];
      const outsideLagosZone = this.shippingConfig.zones['outside_lagos'];

      zones.push({
        zone: 'within_lagos',
        zoneName: lagosZone.name,
        states: lagosZone.states,
        shippingMethod: {
          cost: lagosZone.method.cost,
          name: lagosZone.method.name,
          currency: lagosZone.method.currency,
          estimatedDelivery: lagosZone.method.estimatedDelivery,
        },
      });

      zones.push({
        zone: 'outside_lagos',
        zoneName: outsideLagosZone.name,
        states: outsideLagosZone.states,
        shippingMethod: {
          cost: outsideLagosZone.method.cost,
          name: outsideLagosZone.method.name,
          currency: outsideLagosZone.method.currency,
          estimatedDelivery: outsideLagosZone.method.estimatedDelivery,
        },
      });

      return {
        country: countryCode,
        zones,
      };
    } else {
      // For international countries, find the matching zone
      const zoneKey = this.determineShippingZone(country);
      const zoneConfig = this.shippingConfig.zones[zoneKey];

      if (zoneConfig) {
        zones.push({
          zone: zoneKey,
          zoneName: zoneConfig.name,
          shippingMethod: {
            cost: zoneConfig.method.cost,
            name: zoneConfig.method.name,
            currency: zoneConfig.method.currency,
            estimatedDelivery: zoneConfig.method.estimatedDelivery,
          },
        });
      }

      return {
        country: countryCode,
        zones,
      };
    }
  }

  private determineShippingZone(country: string): string {
    // ensures the country code sent is in upper case
    const countryCode = country.toUpperCase();

    // Find the delivery zone that is contained in the country, will return one zone for europe and america
    for (const [zoneKey, zoneConfig] of Object.entries(
      this.shippingConfig.zones,
    )) {
      if (zoneConfig.countries.includes(countryCode)) {
        return zoneKey;
      }
    }

    return this.shippingConfig.fallback.zone;
  }

  getZoneInfo(zone: string): ShippingZone | null {
    return this.shippingConfig.zones[zone] || null;
  }

  getAllZones(): Record<string, ShippingZone> {
    return this.shippingConfig.zones;
  }

  getCountriesInZone(zone: string): string[] {
    const zoneConfig = this.shippingConfig.zones[zone];
    return zoneConfig ? zoneConfig.countries : [];
  }

  getShippingCostForCountry(country: string): ShippingMethod | null {
    const calculation = this.calculateShipping(country);
    return calculation.shippingMethod;
  }

  // This gets all shipping countries
  // frontend would convert from code to full name
  getShippingCountries(): string[] {
    const countries = new Set<string>();

    Object.values(this.shippingConfig.zones).forEach((zone) => {
      zone.countries.forEach((country) => countries.add(country));
    });

    return Array.from(countries).sort();
  }
}
