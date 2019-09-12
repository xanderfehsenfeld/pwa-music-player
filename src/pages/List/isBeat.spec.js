import isBeat from './isBeat'
describe('isBeat', () => {
  it('matches beats', () => {
    expect(
      isBeat(
        'rae sremmurd - throw sum mo (instrumental) {reprod. by tony skwara}',
      ),
    ).toBeTruthy()
  })

  it("doesn't match songs", () => {
    expect(
      isBeat('death cab for cutie soul meets body with lyrics'),
    ).toBeFalsy()
  })
})
