import { mount } from 'cypress-react-unit-test';
import React from 'react';
import {
  Card,
  HasManyFields,
  FormLabelGroup,
  Input,
  Select,
} from 'react-gears';
import * as gears from '../../src/find';
import * as hasManyFields from '../../src/hasManyFields';

function Squirrel() {
  return (
    <div>
      <Input placeholder="Nickname" />
      <Select
        name="color"
        options={[
          { label: 'Red', value: 'red' },
          { label: 'Green', value: 'green' },
          { label: 'Grey', value: 'boring' },
        ]}
      />
      <select name="type">
        <option value="animated">Animated</option>
        <option value="bravo">bravo</option>
        <option value="charlie">charlie</option>
      </select>
    </div>
  );
}

describe('hasManyFields', () => {
  describe('add', () => {
    it('can fill in text and select hasManyFields', () => {
      mount(
        <Card>
          <FormLabelGroup label="Squirrels">
            <HasManyFields
              errors={[]}
              label="Add a Squirrel"
              maximumRows={5}
              minimumRows={1}
              // onAdd={function noRefCheck() {}}
              // onChange={function noRefCheck() {}}
              // onRemove={function noRefCheck() {}}
              // onUpdate={function noRefCheck() {}}
              // reorderable={false}
              template={Squirrel}
            />
          </FormLabelGroup>
        </Card>
      );
      // const values = [
      //   ['Nickname', 'Color'],
      //   ['Rocky', 'Grey'],
      //   ['Sandy Cheeks', 'Red'],
      // ];

      // const values = [
      //   { Nickname: 'Rocky', Color: 'Grey' },
      //   { Nickname: 'Sandy Cheeks', Rating: 'Red' },
      // ];

      const values = [{ Nickname: 'Rocky' }, { Nickname: 'Sandy Cheeks' }];

      gears.hasManyFields('Squirrels').then($datapair => {
        hasManyFields.add($datapair, values);
      });
    });
  });
});
