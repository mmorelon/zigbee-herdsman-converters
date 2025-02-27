import {Definition} from '../lib/types';
import * as exposes from '../lib/exposes';
import fz from '../converters/fromZigbee';
import tz from '../converters/toZigbee';
import * as legacy from '../lib/legacy';
import * as reporting from '../lib/reporting';
import extend from '../lib/extend';
const e = exposes.presets;

const definitions: Definition[] = [
    {
        zigbeeModel: ['ADUROLIGHT_CSC'],
        model: '15090054',
        vendor: 'AduroSmart',
        description: 'Remote scene controller',
        fromZigbee: [fz.battery, fz.command_toggle, fz.command_recall],
        toZigbee: [],
        exposes: [e.battery(), e.action(['toggle', 'recall_253', 'recall_254', 'recall_255'])],
    },
    {
        zigbeeModel: ['AD-SmartPlug3001'],
        model: '81848',
        vendor: 'AduroSmart',
        description: 'ERIA smart plug (with power measurements)',
        fromZigbee: [fz.on_off, fz.electrical_measurement],
        toZigbee: [tz.on_off],
        exposes: [e.switch(), e.power(), e.current(), e.voltage()],
        configure: async (device, coordinatorEndpoint, logger) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ['genOnOff', 'haElectricalMeasurement']);
            await reporting.onOff(endpoint);
            await reporting.readEletricalMeasurementMultiplierDivisors(endpoint);
            await reporting.rmsVoltage(endpoint);
            await reporting.rmsCurrent(endpoint);
            await reporting.activePower(endpoint);
        },
    },
    {
        zigbeeModel: ['ZLL-ExtendedColo', 'ZLL-ExtendedColor'],
        model: '81809/81813',
        vendor: 'AduroSmart',
        description: 'ERIA colors and white shades smart light bulb A19/BR30',
        extend: extend.light_onoff_brightness_colortemp_color(),
        meta: {applyRedFix: true},
        endpoint: (device) => {
            return {'default': 2};
        },
    },
    {
        zigbeeModel: ['AD-RGBW3001'],
        model: '81809FBA',
        vendor: 'AduroSmart',
        description: 'ERIA colors and white shades smart light bulb A19/BR30',
        extend: extend.light_onoff_brightness_colortemp_color({supportsHueAndSaturation: true, colorTempRange: [153, 500]}),
        meta: {applyRedFix: true},
    },
    {
        zigbeeModel: ['AD-E14RGBW3001'],
        model: '81895',
        vendor: 'AduroSmart',
        description: 'ERIA E14 Candle Color',
        extend: extend.light_onoff_brightness_colortemp_color({colorTempRange: [153, 500]}),
    },
    {
        zigbeeModel: ['AD-DimmableLight3001'],
        model: '81810',
        vendor: 'AduroSmart',
        description: 'Zigbee Aduro Eria B22 bulb - warm white',
        extend: extend.light_onoff_brightness(),
    },
    {
        zigbeeModel: ['Adurolight_NCC'],
        model: '81825',
        vendor: 'AduroSmart',
        description: 'ERIA smart wireless dimming switch',
        fromZigbee: [fz.command_on, fz.command_off, legacy.fz.eria_81825_updown],
        exposes: [e.action(['on', 'off', 'up', 'down'])],
        toZigbee: [],
        configure: async (device, coordinatorEndpoint, logger) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ['genOnOff', 'genLevelCtrl']);
        },
    },
    {
        zigbeeModel: ['AD-Dimmer'],
        model: '81849',
        vendor: 'AduroSmart',
        description: 'ERIA built-in multi dimmer module 300W',
        extend: extend.light_onoff_brightness({noConfigure: true}),
        configure: async (device, coordinatorEndpoint, logger) => {
            await extend.light_onoff_brightness().configure(device, coordinatorEndpoint, logger);
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ['genOnOff', 'genLevelCtrl']);
            await reporting.onOff(endpoint);
            await reporting.brightness(endpoint);
        },
    },
    {
        zigbeeModel: ['BDP3001'],
        model: '81855',
        vendor: 'AduroSmart',
        description: 'ERIA smart plug (dimmer)',
        extend: extend.light_onoff_brightness({noConfigure: true}),
        configure: async (device, coordinatorEndpoint, logger) => {
            await extend.light_onoff_brightness().configure(device, coordinatorEndpoint, logger);
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ['genOnOff', 'genLevelCtrl']);
            await reporting.onOff(endpoint);
            await reporting.brightness(endpoint);
        },
    },
    {
        zigbeeModel: ['BPU3'],
        model: 'BPU3',
        vendor: 'AduroSmart',
        description: 'ERIA smart plug',
        extend: extend.switch(),
        configure: async (device, coordinatorEndpoint, logger) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ['genOnOff']);
            await reporting.onOff(endpoint);
        },
    },
    {
        zigbeeModel: ['Extended Color LED Strip V1.0'],
        model: '81863',
        vendor: 'AduroSmart',
        description: 'Eria color LED strip',
        extend: extend.light_onoff_brightness_colortemp_color({supportsHueAndSaturation: true, colorTempRange: [153, 500]}),
        meta: {applyRedFix: true},
    },
    {
        zigbeeModel: ['AD-81812', 'AD-ColorTemperature3001'],
        model: '81812/81814',
        vendor: 'AduroSmart',
        description: 'Eria tunable white A19/BR30 smart bulb',
        extend: extend.light_onoff_brightness_colortemp_color({supportsHueAndSaturation: true, colorTempRange: [153, 500]}),
    },
];

export default definitions;
module.exports = definitions;
