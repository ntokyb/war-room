/**
 * Extra Claude prompt context for specific categories (e.g. .NET unit testing frameworks).
 * Appended to the user prompt in problemController when category matches.
 */

function norm(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\s+/g, " ")
    .trim();
}

const UNIT_TESTING_OVERVIEW = `UNIT TESTING (GENERAL — pick the framework named in the category string):
- Problems must feel like TestDome: fix/complete test or production code, assert correct behaviour, edge cases, and naming.
- Always include Arrange–Act–Assert structure in examples.
- Cover: test isolation, deterministic tests, meaningful test names, and when to use mocks vs fakes vs stubs.
- platformNotes should mention how automated scoring would evaluate the tests (assertions, coverage of edge cases).`;

const XUNIT = `FRAMEWORK FOCUS — xUnit.net:
- Use [Fact] for single-case tests and [Theory] with [InlineData] / [MemberData] for data-driven tests.
- Use IClassFixture<T> or ICollectionFixture<T> for shared setup when appropriate; prefer constructor injection for dependencies.
- Assertions: Xunit.Assert (Assert.Equal, Assert.True, Assert.Throws, etc.).
- Mention parallel execution by default and that instance fields are not shared between tests unless via fixtures.
- Include at least one complete test class with realistic method names (Given_When_Then or Should_ExpectedWhen_State).`;

const NUNIT = `FRAMEWORK FOCUS — NUnit:
- Use [Test], [TestCase], [TestCaseSource], [Values] for parameterized tests.
- Use [SetUp] / [TearDown] or OneTimeSetUp patterns where they clarify lifecycle; prefer explicit over magic when teaching.
- Assertions: Classic model (Assert.AreEqual) or constraint model (Assert.That(..., Is.EqualTo(...))) — pick one style and stay consistent in the solution.
- Mention [Category] for filtering and why teams use it in CI.`;

const MSTEST = `FRAMEWORK FOCUS — MSTest (Microsoft.VisualStudio.TestTools.UnitTesting):
- Use [TestMethod], [TestInitialize], [TestCleanup], [DataTestMethod] with [DataRow] for parameterized tests.
- First-class Visual Studio / Azure DevOps test explorer integration — mention in platformNotes where relevant.
- Assertions: Assert.AreEqual, Assert.IsTrue, StringAssert, CollectionAssert as appropriate.`;

const TUNIT = `FRAMEWORK FOCUS — TUnit (Microsoft.Testing.Platform):
- Built on Microsoft.Testing.Platform; source-generated discovery, parallel by default, strong Native AOT story (see tunit.dev).
- Typical shape: using TUnit.Core / TUnit.Assertions; [Test] on methods (no [TestClass] wrapper required); async Task tests with await Assert.That(actual).IsEqualTo(expected) (and related fluent assertions).
- Data-driven: [Arguments(...)] / [MatrixDataSource] style rows when the problem needs parameterization.
- Mention lifecycle hooks ([Before(Class)], [Before(EachTest)]) only when the scenario needs shared setup — prefer isolated unit tests otherwise.`;

/**
 * @param {string} platformName e.g. "TestDome"
 * @param {string} category e.g. "Unit Testing — xUnit"
 * @returns {string} extra prompt block or empty string
 */
function getCategoryGuideAddition(platformName, category) {
  const c = norm(category);
  const p = norm(platformName);

  const isTestdome = p.includes("testdome");
  const isUnit =
    c.includes("unit testing") ||
    c.includes("xunit") ||
    c.includes("nunit") ||
    c.includes("mstest") ||
    c.includes("tunit");

  if (!isUnit) return "";

  if (c.includes("xunit")) return `${UNIT_TESTING_OVERVIEW}\n\n${XUNIT}`;
  if (c.includes("nunit")) return `${UNIT_TESTING_OVERVIEW}\n\n${NUNIT}`;
  if (c.includes("mstest")) return `${UNIT_TESTING_OVERVIEW}\n\n${MSTEST}`;
  if (c.includes("tunit")) return `${UNIT_TESTING_OVERVIEW}\n\n${TUNIT}`;

  // Legacy category label "Unit Testing" only (no framework suffix)
  if (isTestdome) {
    return `${UNIT_TESTING_OVERVIEW}

Compare and contrast in the thinkingProcess or platformNotes: xUnit.net (default for new projects, parallel by default, constructor setup), NUnit (parameterized tests, mature ecosystem), MSTest (VS / Azure DevOps integration), TUnit (MTP, performance / AOT). The production code + tests should still use ONE primary framework chosen to match the most likely TestDome scenario — default to xUnit unless the problem statement explicitly names another.`;
  }

  return UNIT_TESTING_OVERVIEW;
}

module.exports = { getCategoryGuideAddition };
